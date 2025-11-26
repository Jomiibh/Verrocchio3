/**
 * Cross-platform wrapper to run `npm run check` with a 20s timeout.
 * Replaces the GNU `timeout` usage that breaks on Windows.
 */
import { spawn } from 'node:child_process';

const timeoutMs = 20_000;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const child = spawn(npmCommand, ['run', 'check'], {
  stdio: 'inherit',
  shell: true,
});

const timer = setTimeout(() => {
  console.error(`Check timed out after ${timeoutMs / 1000} seconds`);
  child.kill('SIGTERM');
}, timeoutMs);

child.on('exit', (code, signal) => {
  clearTimeout(timer);

  // If we killed it due to timeout, treat as failure
  if (signal === 'SIGTERM') {
    process.exit(1);
  }

  process.exit(code ?? 0);
});
