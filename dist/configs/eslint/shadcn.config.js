import { plugin as shadcnPlugin } from '@shadcn/lint';
import { defineConfig } from 'eslint/config';
import { webGlobalIgnores } from './webIgnores.js';
/**
 * shadcn/ui design-system ESLint configuration for Tailwind v4 web projects. Reads components,
 * variants, and theme tokens from the project's `components.json`, so errors suggest the
 * project's own variants and tokens. `src/components/ui/**` is ignored, so these rules only
 * check code that uses the primitives.
 */
export const shadcnConfig = defineConfig([
    webGlobalIgnores,
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        plugins: { shadcn: shadcnPlugin },
        settings: {
            shadcn: {
                note: 'See docs/standards/ui.md. Fix the code or the design system; never add eslint-disable.',
            },
        },
        rules: {
            // Components own their appearance: callers may only place them (margin, width, flex, grid)
            'shadcn/no-restyle': [
                'error',
                {
                    allow: ['layout'],
                    contracts: [
                        // Container slots (DialogContent, SidebarGroup, …) take page-level spacing
                        {
                            pattern: '(Content|Header|Footer|Group|Panel)$',
                            allow: ['layout', 'spacing'],
                        },
                        // Every Card element takes page-level spacing (gap, padding)
                        {
                            pattern: '^Card(Action|Content|Description|Footer|Header|Title)?$',
                            allow: ['layout', 'spacing'],
                        },
                        // Skeletons take the shape of the content they stand in for
                        { pattern: '^Skeleton$', allow: ['layout', 'shape'] },
                    ],
                },
            ],
            // Colours must come from theme tokens, not the Tailwind palette
            'shadcn/no-raw-colors': 'error',
            // Arbitrary values are allowed for layout (e.g. `w-[320px]`), not appearance
            'shadcn/no-arbitrary-values': ['error', { allow: ['layout'] }],
            'shadcn/no-inline-styles': 'error',
            // Class values on components must be readable so the rules above can check them
            'shadcn/require-static-classes': 'error',
            // Catches classes the project's Tailwind cannot generate, e.g. `flex-cols`
            'shadcn/no-unknown-classes': 'error',
        },
    },
]);
//# sourceMappingURL=shadcn.config.js.map