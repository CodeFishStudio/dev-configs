/**
 * Helper function to handle file operations with consistent error handling and output
 */
export declare const handleFileOperation: (targetPath: string, operation: () => void, successMessage: (fileName: string) => string, errorMessage: (fileName: string) => string) => void;
