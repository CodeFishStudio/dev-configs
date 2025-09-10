#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read package.json to get current version
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
const currentVersion = packageJson.version;

// Read README.md
const readmePath = join(rootDir, 'README.md');
let readmeContent = readFileSync(readmePath, 'utf8');

// Replace all instances of the GitHub URL with version tags
const githubUrlPattern = /github:CodeFishStudio\/cfs-dev-configs#v\d+\.\d+\.\d+/g;
const newUrl = `github:CodeFishStudio/cfs-dev-configs#v${currentVersion}`;

const updatedContent = readmeContent.replace(githubUrlPattern, newUrl);

// Write back to README.md
writeFileSync(readmePath, updatedContent, 'utf8');

console.log(`✅ Updated README.md with version v${currentVersion}`);
