import type { ConfigType, ProjectType, SelectOption } from '../../types/index.js';

export const projectTypeOptions: SelectOption<ProjectType>[] = [
    { label: 'React', value: 'react' },
    { label: 'React Native (with Expo)', value: 'reactNative' },
    { label: 'Node', value: 'node' },
];

export const configTypeOptions: SelectOption<ConfigType | 'scripts'>[] = [
    { label: 'ESLint', value: 'eslint' },
    { label: 'Prettier', value: 'prettier' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Add package.json scripts', value: 'scripts' },
];
