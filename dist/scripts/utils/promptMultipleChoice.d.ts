import { SelectOption } from '../../types/index.js';
/**
 * Generic prompt helper for multiple selection with checkboxes
 */
export declare function promptMultipleChoice<T extends string>(title: string, options: SelectOption<T>[]): Promise<T[]>;
