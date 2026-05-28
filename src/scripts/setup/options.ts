import { Option } from '@clack/prompts';

import type { ConfigType, ProjectType } from '../../types/index.js';

export const projectTypeOptions: Option<ProjectType>[] = [
    { label: 'React (TanStack Start)', value: 'reactTanStackStart' },
    { label: 'React (Next.js)', value: 'reactNext' },
    { label: 'React (Vite + React Router)', value: 'reactVite' },
    { label: 'React Native (Expo)', value: 'reactNative' },
    { label: 'Node', value: 'node' },
];

export const configTypeOptions: Option<ConfigType>[] = [
    { label: 'Prettier', value: 'prettier' },
    { label: 'ESLint', value: 'eslint' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Cursor Settings/Rules', value: 'editor' },
];
