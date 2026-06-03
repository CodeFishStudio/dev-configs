import { Option } from '@clack/prompts';

import type { ConfigType, ProjectType } from '../../types/index.js';

export const projectTypeOptions: Option<ProjectType>[] = [
    { label: 'TanStack Start', value: 'tanstackStart' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Vite', value: 'vite' },
    { label: 'Expo (React Native)', value: 'expo' },
    { label: 'Node', value: 'node' },
];

export const configTypeOptions: Option<ConfigType>[] = [
    { label: 'Prettier', value: 'prettier' },
    { label: 'ESLint', value: 'eslint' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Cursor Settings', value: 'cursorSettings' },
    { label: 'Agent Rules & Skills', value: 'agentRulesAndSkills' },
];
