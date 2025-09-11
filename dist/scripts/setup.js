#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read the package.json to get peer dependencies
const packageJsonPath = join(__dirname, '..', '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
// Extract peer dependencies
const peerDeps = packageJson.peerDependencies || {};
const peerDepsMeta = packageJson.peerDependenciesMeta || {};
// Define dependencies for each config type
const configDependencies = {
    react: {
        // Base dependencies (always required)
        '@eslint/js': peerDeps['@eslint/js'],
        eslint: peerDeps['eslint'],
        'eslint-config-prettier': peerDeps['eslint-config-prettier'],
        'eslint-import-resolver-typescript': peerDeps['eslint-import-resolver-typescript'],
        'eslint-plugin-import': peerDeps['eslint-plugin-import'],
        'eslint-plugin-react': peerDeps['eslint-plugin-react'],
        'eslint-plugin-react-hooks': peerDeps['eslint-plugin-react-hooks'],
        globals: peerDeps['globals'],
        'typescript-eslint': peerDeps['typescript-eslint'],
    },
    reactNative: {
        // Base dependencies + React Native specific
        '@eslint/compat': peerDeps['@eslint/compat'],
        '@eslint/js': peerDeps['@eslint/js'],
        eslint: peerDeps['eslint'],
        'eslint-config-prettier': peerDeps['eslint-config-prettier'],
        'eslint-import-resolver-typescript': peerDeps['eslint-import-resolver-typescript'],
        'eslint-plugin-import': peerDeps['eslint-plugin-import'],
        'eslint-plugin-react': peerDeps['eslint-plugin-react'],
        'eslint-plugin-react-hooks': peerDeps['eslint-plugin-react-hooks'],
        'eslint-plugin-react-native': peerDeps['eslint-plugin-react-native'],
        globals: peerDeps['globals'],
        'typescript-eslint': peerDeps['typescript-eslint'],
    },
};
// Function to prompt user for config type
async function promptForConfigType() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        console.log('\n🎯 Which ESLint configuration would you like to set up?');
        console.log('1. React (for web projects)');
        console.log('2. React Native (for mobile projects)');
        rl.question('\nEnter your choice (1 or 2): ', (answer) => {
            rl.close();
            const choice = answer.trim();
            if (choice === '1') {
                resolve('react');
            }
            else if (choice === '2') {
                resolve('reactNative');
            }
            else {
                console.log('❌ Invalid choice. Please enter 1 or 2.');
                process.exit(1);
            }
        });
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
    const requiredDeps = configDependencies[configType];
    console.log(`\n📦 Installing dependencies for ${configType} configuration...`);
    // Build install command
    const depsList = Object.entries(requiredDeps)
        .map(([name, version]) => `${name}@${version}`)
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
    console.log(`Running: ${installCommand}`);
    try {
        execSync(installCommand, { stdio: 'inherit' });
        console.log('✅ Successfully installed all required dev dependencies!');
        console.log('\n📝 Next steps:');
        console.log('1. Create an eslint.config.js file in your project root');
        console.log('2. Import and use the configuration:');
        console.log(`   import { eslintConfigs } from "cfs-dev-configs";`);
        console.log(`   export default eslintConfigs.${configType};`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Failed to install dependencies:', errorMessage);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=setup.js.map