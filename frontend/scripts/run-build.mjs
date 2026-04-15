import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const projectRoot = process.cwd();
const buildGlobalsPath = path.join(projectRoot, 'scripts', 'register-build-globals.cjs');
const rootLayoutPath = path.join(projectRoot, 'src', 'app', 'layout.tsx');
const npmCommand = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
const isWindows = os.platform() === 'win32';
const edgeRuntimeLine = "export const runtime = 'edge';";

function readDotenvValue(key) {
  const envPath = path.join(projectRoot, '.env');
  if (!fs.existsSync(envPath)) return undefined;

  const rows = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const prefix = `${key}=`;
  const row = rows.find((item) => item.trim().startsWith(prefix));
  if (!row) return undefined;

  return row
    .slice(row.indexOf('=') + 1)
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function runNpmScript(script, env) {
  return new Promise((resolve, reject) => {
    const command = isWindows ? `${npmCommand} run ${script}` : npmCommand;
    const args = isWindows ? [] : ['run', script];
    const child = spawn(command, args, {
      cwd: projectRoot,
      env,
      shell: isWindows,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${script} exited with signal ${signal}`));
        return;
      }

      resolve(code ?? 1);
    });
  });
}

function withEdgeRuntimeSetting(enabled) {
  const original = fs.readFileSync(rootLayoutPath, 'utf8');
  const normalized = original.replace(/\r\n/g, '\n');
  const withoutEdgeRuntime = normalized.replace(
    /\nexport const runtime = 'edge';\n/g,
    '\n',
  );
  let nextSource = withoutEdgeRuntime;

  if (enabled && !withoutEdgeRuntime.includes(edgeRuntimeLine)) {
    const anchor = "import { generateSEO } from '@/lib/seo';";
    if (!withoutEdgeRuntime.includes(anchor)) {
      throw new Error('Unable to inject edge runtime into src/app/layout.tsx');
    }

    nextSource = withoutEdgeRuntime.replace(
      anchor,
      `${anchor}\n${edgeRuntimeLine}`,
    );
  }

  if (nextSource !== normalized) {
    fs.writeFileSync(rootLayoutPath, nextSource, 'utf8');
  }

  return () => {
    const restored = original.includes('\r\n')
      ? original
      : original.replace(/\r\n/g, '\n');
    fs.writeFileSync(rootLayoutPath, restored, 'utf8');
  };
}

const capacitorExport = process.env.CAPACITOR_EXPORT ?? readDotenvValue('CAPACITOR_EXPORT');
const shouldUseNodeRuntime = capacitorExport === 'true';
const restoreLayout = withEdgeRuntimeSetting(!shouldUseNodeRuntime);

try {
  if (process.env.SKIP_TYPECHECK !== 'true') {
    const typecheckExitCode = await runNpmScript('typecheck', process.env);
    if (typecheckExitCode !== 0) {
      process.exit(typecheckExitCode);
    }
  }

  const nodeOptions = process.env.NODE_OPTIONS?.trim() || '--max-old-space-size=4096';
  const env = {
    ...process.env,
    NEXT_SKIP_INTERNAL_CHECKS: 'true',
    NODE_OPTIONS: shouldUseNodeRuntime
      ? `${nodeOptions} --require=${buildGlobalsPath}`
      : nodeOptions,
  };

  const exitCode = await runNpmScript('build:next', env);

  process.exit(exitCode);
} catch (error) {
  throw error;
} finally {
  restoreLayout();
}
