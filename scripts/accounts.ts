import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parse } from 'dotenv';
import { sr25519CreateDerive, withNetworkAccount } from '@polkadot-labs/hdkd';
import { generateMnemonic, mnemonicToMiniSecret, parseSuri } from '@polkadot-labs/hdkd-helpers';

// Creates testnet identities only. Private seeds are written to ignored .env;
// stdout and the committed manifest contain PUBLIC addresses only.
const envPath = resolve('.env');
let contents = existsSync(envPath) ? readFileSync(envPath, 'utf8') : readFileSync('.env.example', 'utf8');
const existing = parse(contents);
const roles = ['DEPLOYER', 'RENTER', 'ARBITER', 'RELAYER'] as const;
const accounts: Record<string, { ss58: string; publicKey: string }> = {};
for (const role of roles) {
  const key = `${role}_SEED`;
  const secret = existing[key]?.trim() || generateMnemonic(256);
  if (!existing[key]?.trim()) {
    const entry = `${key}="${secret}"`;
    const pattern = new RegExp(`^${key}=.*$`, 'm');
    contents = pattern.test(contents) ? contents.replace(pattern, entry) : `${contents}\n${entry}\n`;
  }
  const { phrase, paths, password } = parseSuri(secret);
  if (!phrase) throw new Error(`${key} must contain an explicit testnet mnemonic or 32-byte mini-secret.`);
  const seed = /^0x[0-9a-f]{64}$/i.test(phrase) ? phrase : mnemonicToMiniSecret(phrase, password);
  const account = withNetworkAccount(sr25519CreateDerive(seed)(paths ?? ''), 42);
  accounts[role.toLowerCase()] = {
    ss58: account.ss58Address,
    publicKey: `0x${Buffer.from(account.publicKey).toString('hex')}`,
  };
}
writeFileSync(envPath, contents, { mode: 0o600 });
const destination = resolve('deployments/accounts.json');
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, `${JSON.stringify({ network: 'portaldot-v3-testnet', accounts }, null, 2)}\n`);
console.log(JSON.stringify({ network: 'portaldot-v3-testnet', accounts }, null, 2));
console.log('Private seeds remain in ignored .env. Fund only these public testnet addresses.');
