export interface RunShellCommandOptions {
    command: string;
    cwd: string;
    onOutputLine: (line: string) => void;
}
/**
 * Run a shell command with stdout/stderr streamed line-by-line to onOutputLine.
 */
export declare const runShellCommand: (options: RunShellCommandOptions) => Promise<void>;
