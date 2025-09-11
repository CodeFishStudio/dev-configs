import { stdout, stdin } from 'process';
import { CLI_OPTION_INDENT } from './constants.js';
import { TextStyles, KeyCodes } from './enums.js';
/**
 * Generic prompt helper for single selection
 */
export async function promptSingleChoice(title, options) {
    let selectedIndex = 0;
    const renderMenu = () => {
        // Clear screen and move cursor to top
        stdout.write('\x1B[2J\x1B[0f');
        console.log(`${TextStyles.CYAN}?${TextStyles.RESET}${TextStyles.BOLD} ${title}:${TextStyles.RESET}${TextStyles.GRAY} › Use arrow-keys. Return to submit.${TextStyles.RESET}`);
        options.forEach((option, index) => {
            const isSelected = index === selectedIndex;
            if (isSelected) {
                // Selected option: cyan > prefix, cyan underlined text
                console.log(`${TextStyles.CYAN}❯ ${CLI_OPTION_INDENT}${TextStyles.UNDERLINE}${option.label}${TextStyles.RESET}`);
            }
            else {
                // Unselected option: no prefix, white text
                console.log(`  ${CLI_OPTION_INDENT}${option.label}`);
            }
        });
    };
    return new Promise((resolve, reject) => {
        // Set raw mode to capture individual key presses
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        renderMenu();
        const handleKeyPress = (key) => {
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
                    const selectedOption = options[selectedIndex];
                    if (selectedOption) {
                        resolve(selectedOption.value);
                    }
                    else {
                        reject(new Error('No option selected'));
                    }
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
//# sourceMappingURL=promptSingleChoice.js.map