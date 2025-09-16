export interface FileSharerPlugin {
    /**
     * Share a file using the native share dialog on Android and iOS and download the file on Web.
     * @param {ShareFileOptions} options
     * @returns {Promise<void>}
     */
    share(options: ShareFileOptions): Promise<void>;
    /**
     * Share multiple files using the native share dialog on Android and iOS and download the file on Web.
     * @param {ShareMultipleFileOptions} options
     * @returns {Promise<void>}
     */
    shareMultiple(options: ShareMultipleFileOptions): Promise<void>;
}
export interface ShareFileOptions {
    /**
     * The filename with a extension.
     */
    filename: string;
    /**
     * The base64 encoded data or capacitor file url.
     */
    base64Data?: string;
    /**
     * The local path you can find the file
     */
    path?: string;
    /**
     * The content type of the provided data.
     */
    contentType: string;
    /**
     * Custom options for the platform "android"
     */
    android?: {
        /**
         * Override the default share sheet title
         */
        chooserTitle: string;
    };
}
export interface ShareMultipleFileOptions {
    /**
     * Array of file URIs or file paths to share (for already saved files)
     * Use this format when you have files already saved to disk
     */
    files?: string[];
    /**
     * Array of filenames (for base64 data sharing)
     * Use this format when you have base64 data to share
     */
    filenameArray?: string[];
    /**
     * Array of base64 encoded data (for base64 data sharing)
     * Use this format when you have base64 data to share
     */
    base64DataArray?: string[];
    /**
     * The content type of the files (optional)
     * Can be a single string for all files or an array matching the files array
     */
    contentType?: string | string[];
    /**
     * Dialog title for the share chooser (optional)
     */
    dialogTitle?: string;
}
