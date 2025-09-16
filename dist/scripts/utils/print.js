import { TextStyles } from './enums.js';
const INDENT = '  ';
const Icons = {
    SUCCESS: `${TextStyles.GREEN}✔${TextStyles.RESET} `,
    ERROR: `${TextStyles.RED}✖${TextStyles.RESET} `,
    SKIPPED: `${TextStyles.GRAY}○${TextStyles.RESET} `,
};
const getIcon = (type) => {
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
export const print = (message, options) => {
    const { indent = 0, type } = options || {};
    console.log(`${INDENT.repeat(indent)}${getIcon(type)}${message}`);
};
//# sourceMappingURL=print.js.map