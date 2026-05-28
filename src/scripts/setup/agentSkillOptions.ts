import { Option } from '@clack/prompts';

/**
 * Agent skills available via cfs-setup. Add entries here as new skills ship.
 */
export const agentSkillOptions = [
    {
        value: 'build-api',
        label: 'build-api',
        hint: 'TanStack Query API layer `/lib/api/`',
    },
] as const satisfies Option<string>[];
