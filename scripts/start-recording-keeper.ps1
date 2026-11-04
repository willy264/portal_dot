[CmdletBinding()]
param(
    [switch]$Check,
    [switch]$Once,
    [string]$DataDirectory
)

$ErrorActionPreference = 'Stop'
$workspaceRoot = Split-Path -Parent $PSScriptRoot
$keeperEntry = Join-Path $PSScriptRoot 'automatic-refund.ts'
$localNode = Join-Path $workspaceRoot '.tools/node-v22.23.4-win-x64/node.exe'
$nodeExecutable = if (Test-Path -LiteralPath $localNode) {
    $localNode
} else {
    (Get-Command node -ErrorAction Stop).Source
}
$nodeVersion = & $nodeExecutable --version
if ($LASTEXITCODE -ne 0 -or $nodeVersion -notmatch '^v22\.') {
    throw 'Node 22 is required. The workspace provides .tools/node-v22.23.4-win-x64/node.exe.'
}
foreach ($required in @(
    $keeperEntry,
    (Join-Path $workspaceRoot 'node_modules/tsx/dist/loader.mjs'),
    (Join-Path $workspaceRoot 'deployments/corrected-cronpot.json'),
    (Join-Path $workspaceRoot 'deployments/demo-run.json')
)) {
    if (-not (Test-Path -LiteralPath $required)) {
        throw "Required keeper input is missing: $required"
    }
}
if (-not $env:RELAYER_SEED -and -not $env:KEEPER_SEED -and -not (Test-Path -LiteralPath (Join-Path $workspaceRoot '.env'))) {
    throw 'Configure RELAYER_SEED or KEEPER_SEED in the ignored root .env or the current process environment.'
}
if (-not $DataDirectory) {
    $DataDirectory = Join-Path $workspaceRoot 'data/corrected-keeper'
}
$resolvedDataDirectory = [IO.Path]::GetFullPath($DataDirectory)
if ($Check) {
    Write-Output "Keeper prerequisites present; Node $nodeVersion; journal directory $resolvedDataDirectory. No transaction submitted."
    exit 0
}

$previousDataDirectory = $env:DATA_DIR
Push-Location $workspaceRoot
try {
    New-Item -ItemType Directory -Path $resolvedDataDirectory -Force | Out-Null
    $env:DATA_DIR = $resolvedDataDirectory
    Write-Output "Starting the corrected-Cronpot recording keeper. Journal: $resolvedDataDirectory"
    $keeperArguments = @('--import', 'tsx', $keeperEntry, '--keeper-only', '--timeout-ms=120000')
    if ($Once) { $keeperArguments += '--once' }
    & $nodeExecutable @keeperArguments
    $keeperExitCode = $LASTEXITCODE
} finally {
    $env:DATA_DIR = $previousDataDirectory
    Pop-Location
}
exit $keeperExitCode
