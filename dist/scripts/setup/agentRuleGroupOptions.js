const reactProjectTypes = ['nextjs', 'tanstack-start', 'vite', 'expo'];
/**
 * Whether the selected project type is a React stack (web or native).
 */
export const isReactProjectType = (projectType) => reactProjectTypes.includes(projectType);
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
];
const reactAgentRuleGroupOption = {
    value: 'react',
    label: 'React',
};
/**
 * Rule groups offered in cfs-setup, filtered by project type.
 */
export const getAgentRuleGroupOptions = (projectType) => {
    const options = [...baseAgentRuleGroupOptions];
    if (isReactProjectType(projectType)) {
        options.splice(1, 0, reactAgentRuleGroupOption);
    }
    return options;
};
/**
 * Rule groups pre-selected in cfs-setup for the given project type.
 */
export const getInitialAgentRuleGroups = (projectType) => {
    const initialGroups = ['universal'];
    if (isReactProjectType(projectType)) {
        initialGroups.push('react');
    }
    return initialGroups;
};
//# sourceMappingURL=agentRuleGroupOptions.js.map