#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { __dirname } from '../utils/constants.js';

interface PackageJson {
    version: string;
}

// Get the directory of this script
const rootDir = join(__dirname, '..', '..', '..');

// Read package.json to get current version
const packageJson: PackageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
const currentVersion = packageJson.version;

// Read README.md
const readmePath = join(rootDir, 'README.md');
const readmeContent = readFileSync(readmePath, 'utf8');

// Replace all instances of the GitHub URL with version tags
const githubUrlPattern = /github:CodeFishStudio\/dev-configs#v\d+\.\d+\.\d+/g;
const newUrl = `github:CodeFishStudio/dev-configs#v${currentVersion}`;

const updatedContent = readmeContent.replace(githubUrlPattern, newUrl);

// Write back to README.md
writeFileSync(readmePath, updatedContent, 'utf8');

console.log(`✅ Updated README.md with version v${currentVersion}`);
