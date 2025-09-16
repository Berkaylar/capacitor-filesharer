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
     * Array of file URIs or file paths to share
     */
    files: string[];
    /**
     * The content type of the files (optional)
     */
    contentType?: string;
    /**
     * Dialog title for the share chooser (optional)
     */
    dialogTitle?: string;
}
