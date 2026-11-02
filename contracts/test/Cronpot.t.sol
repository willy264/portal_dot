// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TestBase, Vm} from "./TestBase.sol";
import {Cronpot} from "../src/Cronpot.sol";
import {Ping} from "../src/test/Ping.sol";

contract FailingTarget {
    function fail() external pure {
        revert("target rejected");
    }

    function burnGas() external pure {
        assembly { for {} 1 {} {} }
    }

    function hugeReturn() external pure {
        assembly { return(0, 131072) }
    }

    function hugeRevert() external pure {
        assembly { revert(0, 131072) }
    }

    function lateHugeRevert() external view {
        assembly {
            for {} gt(gas(), 70000) {} {}
            revert(0, 131072)
        }
    }
}

contract RejectingExecutor {
    bool public reject = true;
    bool public exhaustGas;

    function run(Cronpot cron, uint256 id) external {
        cron.execute(id);
    }

    function withdraw(Cronpot cron) external {
        cron.withdrawTipCredit();
    }

    function acceptPayments() external {
        reject = false;
        exhaustGas = false;
    }

    function burnOnPayment() external {
        exhaustGas = true;
    }

    receive() external payable {
        if (exhaustGas) {
            assembly { for {} 1 {} {} }
        }
        require(!reject, "no payment");
    }
}

contract ReentrantJobOwner {
    Cronpot public cron;
    uint256 public job;
    bool public cancelled;
    bool public reexecuted;

    constructor(Cronpot cron_) {
        cron = cron_;
    }

    function schedule() external payable {
        job = cron.schedule{value: msg.value}(
            address(this), abi.encodeCall(this.callback, ()), uint64(block.timestamp)
        );
    }

    function callback() external {
        (cancelled,) = address(cron).call(abi.encodeCall(cron.cancel, (job)));
        (reexecuted,) = address(cron).call(abi.encodeCall(cron.execute, (job)));
    }
    receive() external payable {}
}

contract CronpotTest is TestBase {
    Cronpot cron;
    Ping ping;
    FailingTarget bad;
    address constant KEEPER = address(0xCAFE);
    uint128 constant TIP = 3;

    function setUp() public {
        vm.warp(1000);
        vm.deal(address(this), 10 ether);
        cron = new Cronpot(1_000_000, 100_000, 30_000);
        ping = new Ping();
        bad = new FailingTarget();
    }

    function _schedule(address target, bytes memory data, uint64 when) internal returns (uint256) {
        return cron.schedule{value: TIP}(target, data, when);
    }

    function test_ConstructorExposesImmutableExecutionProfile() public view {
        assertEq(cron.TARGET_GAS_LIMIT(), 1_000_000);
        assertEq(cron.POST_CALL_GAS_RESERVE(), 100_000);
        assertEq(cron.TIP_GAS_LIMIT(), 30_000);
        assertEq(cron.MIN_CALL_GAS(), 1_125_874);
        assertEq(cron.MAX_RETURN_DATA(), 4096);
    }

    function test_ConstructorRejectsZeroAllowancesAndNoPostTipReserve() public {
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(0, 100_000, 30_000);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, 100_000, 0);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, 30_000, 30_000);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, 29_999, 30_000);
    }

    function test_ConstructorRejectsInputsAboveRuntimeGasRange() public {
        uint256 aboveMaximum = uint256(type(uint64).max) + 1;
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(aboveMaximum, 100_000, 30_000);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, aboveMaximum, 30_000);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, type(uint64).max, aboveMaximum);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(type(uint256).max, type(uint256).max, 1);
    }

    function test_ConstructorRejectsMinimumBeyondRuntimeGasRange() public {
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(type(uint64).max, 100_000, 30_000);
        vm.expectRevert(Cronpot.BadGasConfiguration.selector);
        new Cronpot(1_000_000, type(uint64).max, 30_000);
    }

    function test_ConstructorAcceptsExactMinimumRuntimeCeiling() public {
        uint256 maximum = type(uint64).max;
        Cronpot boundary = new Cronpot(63, maximum - 63 - 1 - 10_000, 1);
        assertEq(boundary.MIN_CALL_GAS(), maximum);
    }

    function test_CustomProfileRejectsLowOuterGasThenExecutesWithoutLosingTip() public {
        Cronpot configured = new Cronpot(2_000_000, 200_000, 60_000);
        uint256 id = configured.schedule{value: TIP}(
            address(ping), abi.encodeCall(ping.ping, ()), uint64(block.timestamp)
        );
        vm.prank(KEEPER);
        (bool ok, bytes memory reason) =
            address(configured).call{gas: 1_200_000}(abi.encodeCall(configured.execute, (id)));
        assertFalse(ok);
        assertEq(
            keccak256(reason),
            keccak256(
                abi.encodeWithSelector(Cronpot.InsufficientExecutionGas.selector, configured.MIN_CALL_GAS())
            )
        );
        assertEq(uint256(configured.getJob(id).status), uint256(Cronpot.Status.Scheduled));
        assertEq(configured.getJob(id).tip, TIP);
        assertEq(address(configured).balance, TIP);
        assertEq(KEEPER.balance, 0);
        assertEq(ping.count(), 0);
        vm.prank(KEEPER);
        (ok,) = address(configured).call{gas: 2_400_000}(abi.encodeCall(configured.execute, (id)));
        assertTrue(ok);
        assertEq(uint256(configured.getJob(id).status), uint256(Cronpot.Status.Executed));
        assertEq(configured.getJob(id).tip, 0);
        assertEq(KEEPER.balance, TIP);
        assertEq(ping.count(), 1);
    }

    function test_EarlyExecutionRevertsAndPreservesTip() public {
        uint256 id = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1120);
        vm.expectRevert(abi.encodeWithSelector(Cronpot.TooEarly.selector, uint64(1120)));
        cron.execute(id);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Scheduled));
        assertEq(cron.getJob(id).tip, TIP);
    }

    function test_ExecutesAndPaysExecutorExactlyOnce() public {
        uint256 id = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1000);
        vm.prank(KEEPER);
        assertTrue(cron.execute(id));
        assertEq(ping.count(), 1);
        assertEq(KEEPER.balance, TIP);
        assertEq(cron.getJob(id).tip, 0);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Executed));
        vm.expectRevert(Cronpot.NotScheduled.selector);
        cron.execute(id);
        assertEq(ping.count(), 1);
    }

    function test_FailedTargetMarksFailedWithoutReverting() public {
        uint256 id = _schedule(address(bad), abi.encodeCall(bad.fail, ()), 1000);
        vm.prank(KEEPER);
        assertFalse(cron.execute(id));
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Failed));
        assertEq(KEEPER.balance, TIP);
        vm.expectRevert(Cronpot.NotScheduled.selector);
        cron.execute(id);
    }

    function test_CancelOwnerOnlyAndRefunds() public {
        uint256 id = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1000);
        vm.prank(KEEPER);
        vm.expectRevert(Cronpot.NotOwner.selector);
        cron.cancel(id);
        uint256 before = address(this).balance;
        cron.cancel(id);
        assertEq(address(this).balance - before, TIP);
        assertEq(cron.getJob(id).tip, 0);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Cancelled));
        vm.expectRevert(Cronpot.NotScheduled.selector);
        cron.execute(id);
    }

    function test_OversizedTipRejectedWithoutTruncation() public {
        uint256 tooMuch = uint256(type(uint128).max) + 1;
        vm.deal(address(this), tooMuch);
        vm.expectRevert(Cronpot.TipTooLarge.selector);
        cron.schedule{value: tooMuch}(address(ping), "", 1000);
        assertEq(cron.nextJobId(), 1);
        assertEq(address(cron).balance, 0);
    }

    function test_GetJobPreservesDataAndDueState() public {
        bytes memory data = abi.encodeCall(ping.ping, ());
        uint256 id = _schedule(address(ping), data, 1100);
        assertEq(keccak256(cron.getJob(id).data), keccak256(data));
        assertFalse(cron.isDue(id));
        vm.warp(1100);
        assertTrue(cron.isDue(id));
        cron.execute(id);
        assertFalse(cron.isDue(id));
        assertFalse(cron.isDue(999));
    }

    function test_RejectingExecutorGetsDeferredCreditWithoutUndoingTarget() public {
        RejectingExecutor executor = new RejectingExecutor();
        uint256 id = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1000);
        executor.run(cron, id);
        assertEq(ping.count(), 1);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Executed));
        assertEq(cron.tipCredits(address(executor)), TIP);
        assertEq(address(cron).balance, TIP);
        vm.expectRevert(Cronpot.TransferFailed.selector);
        executor.withdraw(cron);
        assertEq(cron.tipCredits(address(executor)), TIP);
        executor.acceptPayments();
        executor.withdraw(cron);
        executor.withdraw(cron);
        assertEq(address(executor).balance, TIP);
        assertEq(cron.tipCredits(address(executor)), 0);
        assertEq(address(cron).balance, 0);
    }

    function test_GasBurningExecutorCannotUndoFailedTarget() public {
        RejectingExecutor executor = new RejectingExecutor();
        executor.burnOnPayment();
        uint256 id = _schedule(address(bad), abi.encodeCall(bad.burnGas, ()), 1000);
        executor.run(cron, id);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Failed));
        assertEq(cron.tipCredits(address(executor)), TIP);
    }

    function test_NearMinimumGasStillSettlesExpensiveFailureAndRejectedTip() public {
        RejectingExecutor executor = new RejectingExecutor();
        executor.burnOnPayment();
        uint256 id = _schedule(address(bad), abi.encodeCall(bad.lateHugeRevert, ()), 1000);
        (bool ok,) = address(executor).call{gas: 1_200_000}(abi.encodeCall(executor.run, (cron, id)));
        assertTrue(ok);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Failed));
        assertEq(cron.tipCredits(address(executor)), TIP);
        assertEq(cron.getJob(id).tip, 0);
    }

    function test_UnderfundedExecutionCannotConsumeJobOrTip() public {
        uint256 id = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1000);
        (bool ok, bytes memory reason) = address(cron).call{gas: 500_000}(abi.encodeCall(cron.execute, (id)));
        assertFalse(ok);
        bytes4 selector;
        assembly { selector := mload(add(reason, 32)) }
        assertEq(bytes32(selector), bytes32(Cronpot.InsufficientExecutionGas.selector));
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Scheduled));
        assertEq(cron.getJob(id).tip, TIP);
        assertEq(ping.count(), 0);
        cron.execute(id);
        assertEq(ping.count(), 1);
    }

    function test_GasBurningTargetIsTerminalFailure() public {
        uint256 id = _schedule(address(bad), abi.encodeCall(bad.burnGas, ()), 1000);
        vm.prank(KEEPER);
        cron.execute(id);
        assertEq(uint256(cron.getJob(id).status), uint256(Cronpot.Status.Failed));
        assertEq(KEEPER.balance, TIP);
    }

    function test_HugeReturnDataIsCappedAndReported() public {
        _assertBoundedData(abi.encodeCall(bad.hugeReturn, ()), true);
    }

    function test_HugeRevertDataIsCappedAndReported() public {
        _assertBoundedData(abi.encodeCall(bad.hugeRevert, ()), false);
    }

    function _assertBoundedData(bytes memory data, bool expectedSuccess) internal {
        uint256 id = _schedule(address(bad), data, 1000);
        vm.recordLogs();
        cron.execute(id);
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bool found;
        bool truncation;
        for (uint256 i; i < logs.length; ++i) {
            if (logs[i].topics[0] == keccak256("JobExecuted(uint256,address,bool,bytes)")) {
                (bool success, bytes memory result) = abi.decode(logs[i].data, (bool, bytes));
                assertTrue(success == expectedSuccess);
                assertEq(result.length, 4096);
                found = true;
            }
            if (logs[i].topics[0] == keccak256("ReturnDataTruncated(uint256,uint256,uint256)")) {
                (uint256 full, uint256 copied) = abi.decode(logs[i].data, (uint256, uint256));
                assertEq(full, 131072);
                assertEq(copied, 4096);
                truncation = true;
            }
        }
        assertTrue(found && truncation);
    }

    function test_CallbackCannotCancelOrExecuteItsOwnJob() public {
        ReentrantJobOwner owner = new ReentrantJobOwner(cron);
        owner.schedule{value: TIP}();
        uint256 id = owner.job();
        vm.prank(KEEPER);
        cron.execute(id);
        assertFalse(owner.cancelled());
        assertFalse(owner.reexecuted());
        assertEq(KEEPER.balance, TIP);
        assertEq(address(owner).balance, 0);
        assertEq(address(cron).balance, 0);
    }

    function test_ScheduledAndDeferredTipLiabilitiesStayFunded() public {
        RejectingExecutor executor = new RejectingExecutor();
        uint256 a = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 1000);
        uint256 b = _schedule(address(ping), abi.encodeCall(ping.ping, ()), 2000);
        executor.run(cron, a);
        assertEq(address(cron).balance, uint256(cron.getJob(b).tip) + cron.tipCredits(address(executor)));
        cron.cancel(b);
        assertEq(address(cron).balance, cron.tipCredits(address(executor)));
    }
}
