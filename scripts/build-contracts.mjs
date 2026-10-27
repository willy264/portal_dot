import { readFile, writeFile } from 'node:fs/promises';
const contracts = [['MeterMend', 'meterMendAbi'], ['Cronpot', 'cronpotAbi'], ['Ping', 'pingAbi']];
let output = '// Generated from solc 0.8.30 / Foundry artifacts. Run pnpm contracts:abi after forge build.\n';
for (const [name, exported] of contracts) {
  const artifact = JSON.parse(await readFile(`contracts/out/${name}.sol/${name}.json`, 'utf8'));
  output += `export const ${exported} = ${JSON.stringify(artifact.abi, null, 2)} as const;\n`;
}
const destination = 'packages/chain/src/abi.ts';
if (process.argv.includes('--check')) {
  if (await readFile(destination, 'utf8') !== output) throw new Error('Committed contract ABIs differ from the compiled contracts. Run pnpm contracts:abi.');
  console.log('Contract ABIs match compiled artifacts.');
} else { await writeFile(destination, output); console.log(`Wrote ${destination}`); }
