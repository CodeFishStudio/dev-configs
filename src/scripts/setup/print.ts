import { Icons } from '../utils/enums.js';

export type PrintType = 'error' | 'success' | 'skipped';

const INDENT = '  ';

const getIcon = (type: PrintType) => {
    switch (type) {
        case 'error':
            return Icons.ERROR;
        case 'success':
            return Icons.SUCCESS;
        case 'skipped':
            return Icons.SKIPPED;
    }
};

export const print = (message: unknown, options: { indent: number; type: PrintType }) => {
    console.log(`${INDENT.repeat(options.indent)}${getIcon(options.type)} ${message}`);
};
