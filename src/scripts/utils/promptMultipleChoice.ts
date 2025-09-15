import { stdout, stdin } from 'process';

import { CLI_OPTION_INDENT } from './constants.js';
import { TextStyles, KeyCodes } from './enums.js';
import { SelectOption } from '../../types/index.js';

/**
 * Generic prompt helper for multiple selection with checkboxes
 */
export async function promptMultipleChoice<T extends string>(
    title: string,
    options: SelectOption<T>[]
): Promise<T[]> {
    let selectedIndex = 0;
    const selectedOptions = new Set<T>(options.map((option) => option.value as T)); // Start with all selected

    const renderMenu = () => {
        // Clear screen and move cursor to top
        stdout.write('\x1B[2J\x1B[0f');

        console.log(
            `${TextStyles.CYAN}?${TextStyles.RESET}${TextStyles.BOLD} ${title}:${TextStyles.RESET}${TextStyles.GRAY} › Use arrow-keys to navigate, space to toggle, return to submit.${TextStyles.RESET}`
        );

        options.forEach((option, index) => {
            const isSelected = index === selectedIndex;
            const isChecked = selectedOptions.has(option.value as T);

            const checkbox = isChecked ? `[${TextStyles.CYAN}✔${TextStyles.RESET}]` : `[ ]`;
            const prefix = isSelected ? `${TextStyles.CYAN}❯${TextStyles.RESET}` : ' ';
            const label = isSelected
                ? `${TextStyles.UNDERLINE}${TextStyles.CYAN}${option.label}${TextStyles.RESET}`
                : option.label;

            console.log(`${prefix} ${CLI_OPTION_INDENT}${checkbox} ${label}`);
        });
    };

    return new Promise((resolve, reject) => {
        // Set raw mode to capture individual key presses
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        renderMenu();

        const handleKeyPress = (key: string) => {
            switch (key) {
                case KeyCodes.CTRL_C: {
                    stdin.setRawMode(false);
                    stdin.pause();
                    process.exit(0);
                    break;
                }
                case KeyCodes.ENTER: {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener('data', handleKeyPress);
                    const selectedArray = Array.from(selectedOptions);
                    if (selectedArray.length > 0) {
                        resolve(selectedArray);
                    } else {
                        reject(new Error('No options selected'));
                    }
                    break;
                }
                case KeyCodes.SPACE: {
                    const currentOption = options[selectedIndex];
                    if (currentOption) {
                        const optionValue = currentOption.value as T;
                        if (selectedOptions.has(optionValue)) {
                            selectedOptions.delete(optionValue);
                        } else {
                            selectedOptions.add(optionValue);
                        }
                    }
                    renderMenu();
                    break;
                }
                case KeyCodes.UP_ARROW: {
                    selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
                    renderMenu();
                    break;
                }
                case KeyCodes.DOWN_ARROW: {
                    selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
                    renderMenu();
                    break;
                }
            }
        };

        stdin.on('data', handleKeyPress);
    });
}
