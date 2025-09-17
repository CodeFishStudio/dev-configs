import type { ConfigType, ProjectType, SelectOption } from '../../types/index.js';

export const projectTypeOptions: SelectOption<ProjectType>[] = [
    { label: 'React (Next.js)', value: 'reactNext' },
    { label: 'React (Vite + React Router)', value: 'reactVite' },
    { label: 'React Native (Expo)', value: 'reactNative' },
    { label: 'Node', value: 'node' },
];

export const configTypeOptions: SelectOption<ConfigType>[] = [
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Prettier', value: 'prettier' },
    { label: 'ESLint', value: 'eslint' },
    { label: 'Cursor Settings/Rules', value: 'editor' },
];
