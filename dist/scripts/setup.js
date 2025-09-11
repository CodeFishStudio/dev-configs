#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { stdin, stdout } from 'process';
import { dependencies as nodeDependencies } from '../configs/eslint/node.js';
import { dependencies as reactDependencies } from '../configs/eslint/react.js';
import { dependencies as reactNativeDependencies } from '../configs/eslint/reactNative.js';
const KeyCodes = {
    CTRL_C: '\u0003',
    ENTER: '\u000d',
    UP_ARROW: '\u001b[A',
    DOWN_ARROW: '\u001b[B',
};
const Styles = {
    CYAN: '\x1B[36m',
    GRAY: '\x1B[90m',
    BOLD: '\x1B[1m',
    UNDERLINE: '\x1B[4m',
    RESET: '\x1B[0m',
};
// Map config types to their dependencies
const lintConfigDependencies = {
    node: nodeDependencies,
    react: reactDependencies,
    reactNative: reactNativeDependencies,
};
const options = {
    react: {
        label: 'React',
    },
    reactNative: {
        label: 'React Native',
    },
    node: {
        label: 'Node',
    },
};
// Function to prompt user for config type with arrow key navigation
async function promptForConfigType() {
    const configTypes = Object.keys(options);
    let selectedIndex = 0;
    const renderMenu = () => {
        // Clear screen and move cursor to top
        stdout.write('\x1B[2J\x1B[0f');
        const INDENT = '  ';
        console.log(`${Styles.CYAN}?${Styles.RESET}${Styles.BOLD} Choose an ESLint config:${Styles.RESET}${Styles.GRAY} › Use arrow-keys. Return to submit.${Styles.RESET}`);
        configTypes.forEach((configType, index) => {
            const option = options[configType];
            const isSelected = index === selectedIndex;
            if (isSelected) {
                // Selected option: cyan > prefix, cyan underlined text, white description
                console.log(`${Styles.CYAN}❯ ${INDENT}${Styles.UNDERLINE}${option.label}${Styles.RESET}`);
            }
            else {
                // Unselected option: no prefix, white text
                console.log(`  ${INDENT}${option.label}`);
            }
        });
    };
    return new Promise((resolve, reject) => {
        // Set raw mode to capture individual key presses
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        renderMenu();
        const handleKeyPress = (key) => {
            switch (key) {
                case KeyCodes.CTRL_C: {
                    stdin.setRawMode(false);
                    stdin.pause();
                    process.exit(0);
                    break;
                }
                case KeyCodes.ENTER: {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener('data', handleKeyPress);
                    const selectedConfigType = configTypes[selectedIndex];
                    if (selectedConfigType) {
                        resolve(selectedConfigType);
                    }
                    else {
                        reject(new Error('No option selected'));
                    }
                    break;
                }
                case KeyCodes.UP_ARROW: {
                    selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : configTypes.length - 1;
                    renderMenu();
                    break;
                }
                case KeyCodes.DOWN_ARROW: {
                    selectedIndex = selectedIndex < configTypes.length - 1 ? selectedIndex + 1 : 0;
                    renderMenu();
                    break;
                }
            }
        };
        stdin.on('data', handleKeyPress);
    });
}
// Check if we're in a project directory
const projectPackageJsonPath = join(process.cwd(), 'package.json');
if (!existsSync(projectPackageJsonPath)) {
    console.error('❌ No package.json found in current directory. Please run this command from your project root.');
    process.exit(1);
}
// Detect package manager
let packageManager = 'npm';
if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
}
else if (existsSync(join(process.cwd(), 'yarn.lock'))) {
    packageManager = 'yarn';
}
console.log(`🔧 Detected package manager: ${packageManager}`);
// Main execution
async function main() {
    const configType = await promptForConfigType();
    const requiredDeps = lintConfigDependencies[configType];
    if (!requiredDeps) {
        console.error(`❌ No dependencies found for config type: ${configType}`);
        process.exit(1);
    }
    console.log(`\n📦 Installing dev dependencies...\n`);
    // Build install command with all dependencies
    const depsList = Object.entries(requiredDeps)
        .map(([name, version]) => `"${name}@${version}"`)
        .join(' ');
    let installCommand;
    switch (packageManager) {
        case 'pnpm':
            installCommand = `pnpm add --save-dev ${depsList}`;
            break;
        case 'yarn':
            installCommand = `yarn add --dev ${depsList}`;
            break;
        default:
            installCommand = `npm install --save-dev ${depsList}`;
    }
    try {
        execSync(installCommand, { stdio: 'inherit' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to install dependencies:', errorMessage);
        process.exit(1);
    }
    console.log('\n✅ Successfully installed dev dependencies\n');
}
main().catch(console.error);
//# sourceMappingURL=setup.js.map