import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const projectRoot = process.cwd();
const buildGlobalsPath = path.join(projectRoot, 'scripts', 'register-build-globals.cjs');
const shouldUseNodeRuntime = process.env.CAPACITOR_EXPORT === 'true';

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

  process.exit(exitCode);
} catch (error) {
  throw error;
}
