import { SelectOption } from '../../types';
/**
 * Generic prompt helper for single selection
 */
export declare function promptSingleChoice<T extends string>(title: string, options: SelectOption<T>[]): Promise<T>;
