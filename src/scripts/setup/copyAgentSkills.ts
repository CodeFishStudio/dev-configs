import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { logStep } from './utils.js';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';

/**
 * Recursively copy a skill directory into the target, overwriting files at the same path.
 */
const copySkillDirectory = (sourceDir: string, targetDir: string): number => {
    if (!existsSync(sourceDir)) {
        return 0;
    }

    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
    }

    const items = readdirSync(sourceDir);
    let copied = 0;

    items.forEach((item) => {
        const sourcePath = join(sourceDir, item);
        const targetPath = join(targetDir, item);

        if (statSync(sourcePath).isDirectory()) {
            copied += copySkillDirectory(sourcePath, targetPath);
            return;
        }

        fileActions.copySilent(sourcePath, targetPath);
        copied++;
    });

    return copied;
};

/**
 * Copy selected agent skill folders to `.cursor/skills/<skill-id>/`.
 * Overwrites any existing skill files at the same path; other files in those folders are left unchanged.
 */
export const copyAgentSkills = (selectedSkillIds: string[]): void => {
    if (selectedSkillIds.length === 0) {
        return;
    }

    const skillsSourceDir = join(__dirname, '..', '..', 'configs', 'agents', 'skills');
    const targetSkillsDir = join(process.cwd(), '.cursor', 'skills');

    try {
        if (!existsSync(targetSkillsDir)) {
            mkdirSync(targetSkillsDir, { recursive: true });
        }

        let totalCopied = 0;

        selectedSkillIds.forEach((skillId) => {
            const sourceDir = join(skillsSourceDir, skillId);
            const targetDir = join(targetSkillsDir, skillId);

            if (!existsSync(sourceDir)) {
                logStep(`Agent skill not found: ${skillId}`, 'error');
                return;
            }

            totalCopied += copySkillDirectory(sourceDir, targetDir);
        });

        if (totalCopied > 0) {
            logStep(
                `Installed ${totalCopied} agent skill file${totalCopied === 1 ? '' : 's'}`,
                'success'
            );
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy agent skills: ${errorMessage}`, 'error');
    }
};
