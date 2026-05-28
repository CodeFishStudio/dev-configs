/**
 * Style text with 24-bit foreground and background colors (terminal truecolor).
 * `styleText` only supports named ANSI colors, not hex values.
 */
export declare const styleHexText: (text: string, foregroundHex: string, backgroundHex: string) => string;
export declare const logStep: (message: string, type: "success" | "skipped" | "error") => void;
