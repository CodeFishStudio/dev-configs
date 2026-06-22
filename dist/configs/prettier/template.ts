import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { usesTailwindCss } from './dependencies.js';
import type { ProjectType } from '../../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Returns the shared CodeFish `.prettierrc` contents for the given project type.
 */
export const prettierRcFileTemplate = (projectType: ProjectType): string => {
    const configFileName = usesTailwindCss(projectType) ? 'tailwind.prettierrc' : '.prettierrc';
    const sourcePath = join(__dirname, configFileName);
    const content = readFileSync(sourcePath, 'utf-8');

    return content.endsWith('\n') ? content : `${content}\n`;
};
