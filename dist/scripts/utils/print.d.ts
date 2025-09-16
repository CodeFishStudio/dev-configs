export type PrintType = 'error' | 'success' | 'skipped';
type PrintOptions = {
    indent?: number;
    type?: PrintType;
};
export declare const print: (message: unknown, options?: PrintOptions) => void;
export {};
