/**
 * Cross-platform Radix lint runner.
 * Finds files in src/ containing "<SelectItem" and runs eslint with the Radix config on them.
 * Replaces the Unix-only `grep ... | xargs eslint` pipeline.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const srcDir = path.join(root, 'src');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

async function findFilesWithSelectItem() {
  try {
    const files = await walk(srcDir);
    const targets = [];

    for (const file of files) {
      if (!/\.(t|j)sx?$/.test(file)) continue;
      const content = await fs.readFile(file, 'utf8');
      if (content.includes('<SelectItem')) {
        targets.push(file);
      }
    }

    return targets;
  } catch (err) {
    console.error('Failed to scan src for SelectItem usage:', err);
    process.exit(1);
  }
}

async function run() {
  const targets = await findFilesWithSelectItem();

  if (targets.length === 0) {
    console.log('No files with <SelectItem found; skipping Radix lint.');
    return;
  }

  const eslintCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = [
    'eslint',
    '--config',
    path.join('config', 'eslint', 'eslint.radix.config.js'),
    '--fix',
    ...targets,
  ];

  const child = spawn(eslintCmd, args, { stdio: 'inherit' });
  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

run();
