export const KeyCodes = {
    CTRL_C: '\u0003',
    ENTER: '\u000d',
    SPACE: '\u0020',
    UP_ARROW: '\u001b[A',
    DOWN_ARROW: '\u001b[B',
};
export const TextStyles = {
    CYAN: '\x1B[36m',
    GREEN: '\x1B[32m',
    RED: '\x1B[31m',
    GRAY: '\x1B[90m',
    BOLD: '\x1B[1m',
    UNDERLINE: '\x1B[4m',
    RESET: '\x1B[0m',
};
export const Icons = {
    SUCCESS: `${TextStyles.GREEN}✔${TextStyles.RESET}`,
    ERROR: `${TextStyles.RED}✖${TextStyles.RESET}`,
    SKIPPED: `${TextStyles.GRAY}○${TextStyles.RESET}`,
};
//# sourceMappingURL=enums.js.map