import { log } from '@clack/prompts';
import { styleText } from 'node:util';
export const logStep = (message, type) => {
    switch (type) {
        case 'success':
            log.message(styleText('gray', message), {
                symbol: undefined,
                withGuide: true,
                spacing: 0,
            });
            break;
        case 'skipped':
            log.message(styleText('yellow', message), {
                symbol: undefined,
                withGuide: true,
                spacing: 0,
            });
            break;
        case 'error':
            log.message(styleText('red', message), {
                symbol: undefined,
                withGuide: true,
                spacing: 0,
            });
            break;
    }
};
//# sourceMappingURL=utils.js.map