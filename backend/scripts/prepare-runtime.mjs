import { spawnSync } from 'node:child_process';

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const isProductionRuntime =
    Boolean(process.env.RENDER) || process.env.NODE_ENV === 'production';

  if (isProductionRuntime) {
    throw new Error('DATABASE_URL is required in production/runtime environment');
  }

  return 'file:./prisma/dev.db';
}

function runCommand(command, args) {
  const isWindows = process.platform === 'win32';
  const result = isWindows
    ? spawnSync(
        process.env.ComSpec ?? 'cmd.exe',
        ['/d', '/s', '/c', [command, ...args].map(quoteForCmd).join(' ')],
        {
          stdio: 'inherit',
          env: process.env,
        },
      )
    : spawnSync(command, args, {
        stdio: 'inherit',
        env: process.env,
      });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function quoteForCmd(value) {
  const text = String(value);
  if (!/[ \t"]/g.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

const databaseUrl = resolveDatabaseUrl();
const prismaCommand = 'npx';
const isSqlite = databaseUrl.startsWith('file:');

console.log('============================================');
console.log('  MK Academy Backend - runtime prepare');
console.log('============================================');
console.log(`-> DATABASE_URL: ${databaseUrl}`);
console.log('');
console.log('-> Generating Prisma client...');
runCommand(prismaCommand, ['prisma', 'generate']);
console.log('');

if (isSqlite) {
  console.log('-> Syncing Prisma schema for SQLite...');
  runCommand(prismaCommand, ['prisma', 'db', 'push', '--skip-generate']);
} else {
  console.log('-> Running Prisma migrations...');
  runCommand(prismaCommand, ['prisma', 'migrate', 'deploy']);
}
