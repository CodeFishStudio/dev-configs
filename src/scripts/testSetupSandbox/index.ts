#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const sandboxDir = join(rootDir, '.sandbox');
const setupEntry = join(rootDir, 'dist/scripts/setup/index.js');

const scaffoldSandbox = (): void => {
    mkdirSync(sandboxDir, { recursive: true });

    const packageJsonPath = join(sandboxDir, 'package.json');
    if (existsSync(packageJsonPath)) {
        return;
    }

    writeFileSync(
        packageJsonPath,
        `${JSON.stringify(
            {
                name: 'cfs-setup-sandbox',
                private: true,
                version: '0.0.0',
            },
            null,
            2
        )}\n`
    );

    console.log('Scaffolded .sandbox/package.json');
};

const ensureBuilt = (): void => {
    if (existsSync(setupEntry)) {
        return;
    }

    console.log('dist/scripts/setup not found — running build…');

    const build = spawnSync('bun', ['run', 'build'], { cwd: rootDir, stdio: 'inherit' });

    if (build.status !== 0) {
        process.exit(build.status ?? 1);
    }
};

const runSetup = (): void => {
    console.log(`Running cfs-setup in ${sandboxDir}\n`);

    const setup = spawnSync(process.execPath, [setupEntry], {
        cwd: sandboxDir,
        stdio: 'inherit',
    });

    process.exit(setup.status ?? 1);
};

scaffoldSandbox();
ensureBuilt();
runSetup();
