import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const projectRoot = process.cwd();
const layoutPath = path.join(projectRoot, 'src', 'app', 'layout.tsx');
const notFoundPath = path.join(projectRoot, 'src', 'app', 'not-found.tsx');
const buildGlobalsPath = path.join(projectRoot, 'scripts', 'register-build-globals.cjs');
const shouldUseNodeRuntime = process.env.CAPACITOR_EXPORT === 'true';
const originalLayout = await readFile(layoutPath, 'utf8');
const originalNotFound = await readFile(notFoundPath, 'utf8');

if (!originalLayout.includes("export const runtime = 'edge';")) {
  throw new Error("Expected to find `export const runtime = 'edge';` in src/app/layout.tsx");
}
if (!originalNotFound.includes("export const runtime = 'edge';")) {
  throw new Error("Expected to find `export const runtime = 'edge';` in src/app/not-found.tsx");
}

const patchedLayout = shouldUseNodeRuntime
  ? originalLayout.replace("export const runtime = 'edge';", "export const runtime = 'nodejs';")
  : originalLayout;
const patchedNotFound = shouldUseNodeRuntime
  ? originalNotFound.replace("export const runtime = 'edge';", "export const runtime = 'nodejs';")
  : originalNotFound;

if (patchedLayout !== originalLayout) {
  await writeFile(layoutPath, patchedLayout, 'utf8');
}
if (patchedNotFound !== originalNotFound) {
  await writeFile(notFoundPath, patchedNotFound, 'utf8');
}

const restoreLayout = async () => {
  await writeFile(layoutPath, originalLayout, 'utf8');
  await writeFile(notFoundPath, originalNotFound, 'utf8');
};

try {
  const exitCode = await new Promise((resolve, reject) => {
    const npmCommand = os.platform() === 'win32' ? 'npm.cmd' : 'npm';
    const nodeOptions = process.env.NODE_OPTIONS?.trim();
    const env = {
      ...process.env,
      ...(shouldUseNodeRuntime
        ? {
            NODE_OPTIONS: nodeOptions
              ? `${nodeOptions} --require=${buildGlobalsPath}`
              : `--require=${buildGlobalsPath}`,
          }
        : {}),
    };
    const child = spawn(npmCommand, ['run', 'build:next'], {
      cwd: projectRoot,
      env,
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
