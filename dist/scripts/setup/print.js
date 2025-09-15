import { Icons } from '../utils/enums.js';
const INDENT = '  ';
const getIcon = (type) => {
    switch (type) {
        case 'error':
            return Icons.ERROR;
        case 'success':
            return Icons.SUCCESS;
        case 'skipped':
            return Icons.SKIPPED;
    }
};
export const print = (message, options) => {
    console.log(`${INDENT.repeat(options.indent)}${getIcon(options.type)} ${message}`);
};
//# sourceMappingURL=print.js.map