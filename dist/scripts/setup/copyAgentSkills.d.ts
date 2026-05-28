/**
 * Copy selected agent skill folders to `.cursor/skills/<skill-id>/`.
 * Overwrites any existing skill files at the same path; other files in those folders are left unchanged.
 */
export declare const copyAgentSkills: (selectedSkillIds: string[]) => void;
