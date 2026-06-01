import { Option } from '@clack/prompts';

import type { ProjectType } from '../../types/index.js';

export type AgentRuleGroup = 'universal' | 'react' | 'supabase' | 'ui';

const reactProjectTypes: ProjectType[] = [
    'reactNext',
    'reactTanStackStart',
    'reactVite',
    'reactNative',
];

/**
 * Whether the selected project type is a React stack (web or native).
 */
export const isReactProjectType = (projectType: ProjectType): boolean =>
    reactProjectTypes.includes(projectType);

const baseAgentRuleGroupOptions = [
    {
        value: 'universal',
        label: 'Universal',
        hint: 'Code style, TypeScript, etc.',
    },
    {
        value: 'supabase',
        label: 'Supabase',
    },
    {
        value: 'ui',
        label: 'UI',
    },
] as const satisfies Option<AgentRuleGroup>[];

const reactAgentRuleGroupOption = {
    value: 'react',
    label: 'React',
} as const satisfies Option<AgentRuleGroup>;

/**
 * Rule groups offered in cfs-setup, filtered by project type.
 */
export const getAgentRuleGroupOptions = (projectType: ProjectType): Option<AgentRuleGroup>[] => {
    const options: Option<AgentRuleGroup>[] = [...baseAgentRuleGroupOptions];

    if (isReactProjectType(projectType)) {
        options.splice(1, 0, reactAgentRuleGroupOption);
    }

    return options;
};

/**
 * Rule groups pre-selected in cfs-setup for the given project type.
 */
export const getInitialAgentRuleGroups = (projectType: ProjectType): AgentRuleGroup[] => {
    const initialGroups: AgentRuleGroup[] = ['universal'];

    if (isReactProjectType(projectType)) {
        initialGroups.push('react');
    }

    return initialGroups;
};
