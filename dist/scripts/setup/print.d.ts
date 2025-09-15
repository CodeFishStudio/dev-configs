export type PrintType = 'error' | 'success' | 'skipped';
export declare const print: (message: unknown, options: {
    indent: number;
    type: PrintType;
}) => void;
