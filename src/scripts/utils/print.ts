import { TextStyles } from './enums.js';

export type PrintType = 'error' | 'success' | 'skipped';

type PrintOptions = {
    indent?: number;
    type?: PrintType;
};

const INDENT = '  ';

const Icons = {
    SUCCESS: `${TextStyles.GREEN}✔${TextStyles.RESET} `,
    ERROR: `${TextStyles.RED}✖${TextStyles.RESET} `,
    SKIPPED: `${TextStyles.GRAY}○${TextStyles.RESET} `,
} as const;

const getIcon = (type: PrintType | undefined) => {
    switch (type) {
        case 'error':
            return Icons.ERROR;
        case 'success':
            return Icons.SUCCESS;
        case 'skipped':
            return Icons.SKIPPED;
        default:
            return '';
    }
};

export const print = (message: unknown, options?: PrintOptions) => {
    const { indent = 0, type } = options || {};

    console.log(`${INDENT.repeat(indent)}${getIcon(type)}${message}`);
};
