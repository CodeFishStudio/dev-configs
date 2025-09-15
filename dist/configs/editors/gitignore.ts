/**
 * Gitignore patterns for code editor configuration files
 */
export const gitignorePatterns = [
    '.idea/*',
    '!.idea/prettier.xml',
    '!.idea/codeStyles/codeStyleConfig.xml',
    '!.idea/jsLinters/eslint.xml',
] as const;
