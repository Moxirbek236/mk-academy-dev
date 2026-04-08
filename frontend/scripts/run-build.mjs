import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const projectRoot = process.cwd();
const layoutPath = path.join(projectRoot, 'src', 'app', 'layout.tsx');
const shouldUseNodeRuntime = process.env.CAPACITOR_EXPORT === 'true';
const originalLayout = await readFile(layoutPath, 'utf8');

if (!originalLayout.includes("export const runtime = 'edge';")) {
  throw new Error("Expected to find `export const runtime = 'edge';` in src/app/layout.tsx");
}

const patchedLayout = shouldUseNodeRuntime
  ? originalLayout.replace("export const runtime = 'edge';", "export const runtime = 'nodejs';")
  : originalLayout;

if (patchedLayout !== originalLayout) {
  await writeFile(layoutPath, patchedLayout, 'utf8');
}

const restoreLayout = async () => {
  await writeFile(layoutPath, originalLayout, 'utf8');
};

try {
  const exitCode = await new Promise((resolve, reject) => {
    const npmCommand = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npmCommand, ['run', 'build:next'], {
      cwd: projectRoot,
      env: process.env,
      shell: os.platform() === 'win32',
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`next build exited with signal ${signal}`));
        return;
      }

      resolve(code ?? 1);
    });
  });

  await restoreLayout();
  process.exit(exitCode);
} catch (error) {
  await restoreLayout();
  throw error;
}
