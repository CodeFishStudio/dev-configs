import { log } from '@clack/prompts';
import { styleText } from 'node:util';

const ANSI_RESET = '\x1b[0m';

type Rgb = {
    red: number;
    green: number;
    blue: number;
};

const parseHexColor = (hex: string): Rgb => {
    const normalized = hex.replace('#', '');
    return {
        red: parseInt(normalized.slice(0, 2), 16),
        green: parseInt(normalized.slice(2, 4), 16),
        blue: parseInt(normalized.slice(4, 6), 16),
    };
};

/**
 * Style text with 24-bit foreground and background colors (terminal truecolor).
 * `styleText` only supports named ANSI colors, not hex values.
 */
export const styleHexText = (
    text: string,
    foregroundHex: string,
    backgroundHex: string
): string => {
    const foreground = parseHexColor(foregroundHex);
    const background = parseHexColor(backgroundHex);

    return `\x1b[38;2;${foreground.red};${foreground.green};${foreground.blue}m\x1b[48;2;${background.red};${background.green};${background.blue}m${text}${ANSI_RESET}`;
};

export const logStep = (message: string, type: 'success' | 'skipped' | 'error') => {
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
