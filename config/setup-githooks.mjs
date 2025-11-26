/**
 * Cross-platform prepare hook.
 * If bin/setup-githooks.sh exists and a POSIX shell is available, run it.
 * Otherwise, skip quietly to avoid Windows cmd.exe errors.
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const hookScript = './bin/setup-githooks.sh';

if (!existsSync(hookScript)) {
  process.exit(0);
}

// Prefer `sh` if available; Windows users with Git Bash typically have it.
const shell = process.platform === 'win32' ? 'sh' : 'sh';
const result = spawnSync(shell, [hookScript], { stdio: 'inherit' });

if (result.error) {
  console.warn(`Skipping git hook setup: ${result.error.message}`);
  process.exit(0);
}

process.exit(result.status ?? 0);
