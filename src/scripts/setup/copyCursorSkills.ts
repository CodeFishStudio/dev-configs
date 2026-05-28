import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { logStep } from './utils.js';
import { __dirname } from '../utils/constants.js';
import { fileActions } from '../utils/fileActions.js';

type CopyCounts = {
    copied: number;
    skipped: number;
};

/**
 * Recursively copy a skill directory into the target, skipping files that already exist.
 */
const copySkillDirectory = (sourceDir: string, targetDir: string): CopyCounts => {
    if (!existsSync(sourceDir)) {
        return { copied: 0, skipped: 0 };
    }

    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
    }

    const items = readdirSync(sourceDir);
    let copied = 0;
    let skipped = 0;

    items.forEach((item) => {
        const sourcePath = join(sourceDir, item);
        const targetPath = join(targetDir, item);

        if (statSync(sourcePath).isDirectory()) {
            const nested = copySkillDirectory(sourcePath, targetPath);
            copied += nested.copied;
            skipped += nested.skipped;
            return;
        }

        if (fileActions.skipIfExistsSilent(targetPath)) {
            skipped++;
            return;
        }

        fileActions.copySilent(sourcePath, targetPath);
        copied++;
    });

    return { copied, skipped };
};

/**
 * Copy selected agent skill folders to `.cursor/skills/<skill-id>/`.
 */
export const copyCursorSkills = (selectedSkillIds: string[]): void => {
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
        let totalSkipped = 0;

        selectedSkillIds.forEach((skillId) => {
            const sourceDir = join(skillsSourceDir, skillId);
            const targetDir = join(targetSkillsDir, skillId);

            if (!existsSync(sourceDir)) {
                logStep(`Agent skill not found: ${skillId}`, 'error');
                return;
            }

            const { copied, skipped } = copySkillDirectory(sourceDir, targetDir);
            totalCopied += copied;
            totalSkipped += skipped;
        });

        if (totalSkipped > 0) {
            logStep(
                `Skipped copying ${totalSkipped} agent skill file${totalSkipped === 1 ? '' : 's'}`,
                'skipped'
            );
        }
        if (totalCopied > 0) {
            logStep(
                `Copied ${totalCopied} agent skill file${totalCopied === 1 ? '' : 's'}`,
                'success'
            );
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep(`Failed to copy agent skills: ${errorMessage}`, 'error');
    }
};
