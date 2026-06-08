import { spawn } from 'node:child_process';

export interface RunShellCommandOptions {
    command: string;
    cwd: string;
    onOutputLine: (line: string) => void;
}

/**
 * Buffer a byte stream into lines and invoke onOutputLine for each non-empty trimmed line.
 */
const createLineStreamHandler = (
    onOutputLine: (line: string) => void,
    onChunk: (chunk: string) => void
) => {
    let buffer = '';

    const flushBuffer = () => {
        const trimmed = buffer.trim();
        if (trimmed) {
            onOutputLine(trimmed);
        }
        buffer = '';
    };

    const handleData = (chunk: string) => {
        onChunk(chunk);
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed) {
                onOutputLine(trimmed);
            }
        });
    };

    return { handleData, flushBuffer };
};

/**
 * Run a shell command with stdout/stderr streamed line-by-line to onOutputLine.
 */
export const runShellCommand = async (options: RunShellCommandOptions): Promise<void> => {
    const { command, cwd, onOutputLine } = options;

    return new Promise((resolve, reject) => {
        const child = spawn(command, {
            cwd,
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stderr = '';

        const stdoutHandler = createLineStreamHandler(onOutputLine, () => {});
        const stderrHandler = createLineStreamHandler(onOutputLine, (chunk) => {
            stderr += chunk;
        });

        child.stdout?.setEncoding('utf8');
        child.stderr?.setEncoding('utf8');

        child.stdout?.on('data', stdoutHandler.handleData);
        child.stderr?.on('data', stderrHandler.handleData);

        child.stdout?.on('end', stdoutHandler.flushBuffer);
        child.stderr?.on('end', stderrHandler.flushBuffer);

        child.on('error', reject);

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            const message = stderr.trim() || `Command failed with exit code ${code ?? 'unknown'}`;
            reject(new Error(message));
        });
    });
};
