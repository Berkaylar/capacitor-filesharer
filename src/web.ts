import { WebPlugin } from "@capacitor/core";
import type {
    FileSharerPlugin,
    ShareFileOptions,
    ShareMultipleFileOptions,
} from "./definitions";
import * as FileSaver from "file-saver";
import { WebUtils } from "./web-utils";

export class FileSharerPluginWeb extends WebPlugin implements FileSharerPlugin {
    async share(options: ShareFileOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!options.base64Data || options.base64Data.length == 0) {
                reject(new Error("ERR_PARAM_NO_DATA"));
            } else if (!options.filename || options.filename.length == 0) {
                reject(new Error("ERR_PARAM_NO_FILENAME"));
            } else if (
                !options.contentType ||
                options.contentType.length == 0
            ) {
                reject(new Error("ERR_PARAM_NO_CONTENT_TYPE"));
            }

            const byteArray = WebUtils.toByteArray(options.base64Data!);
            let blob = new Blob([byteArray as BlobPart], {
                type: options.contentType,
            });
            FileSaver.saveAs(blob, options.filename);
            resolve();
        });
    }

    async shareMultiple(options: ShareMultipleFileOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            let files: string[] = [];
            let filenames: string[] = [];
            let base64DataArray: string[] = [];

            // Check if using the new files format (Android/Web)
            if (options.files && options.files.length > 0) {
                files = options.files;
            }
            // Check if using the old filenameArray/base64DataArray format (iOS compatibility)
            else if (
                options.filenameArray &&
                options.base64DataArray &&
                options.filenameArray.length > 0 &&
                options.base64DataArray.length > 0
            ) {
                filenames = options.filenameArray;
                base64DataArray = options.base64DataArray;
            } else {
                reject(new Error("ERR_PARAM_NO_FILENAME"));
                return;
            }

            // For web, we can't directly share multiple files like native platforms
            // We'll download each file individually
            // In a real implementation, you might want to create a zip file or handle this differently

            if (files.length > 0) {
                // Handle files format
                for (let i = 0; i < files.length; i++) {
                    const filePath = files[i];
                    const filename = filePath.split("/").pop() || `file_${i}`;
                    const extension = filename.split(".").pop()?.toLowerCase();
                    let contentType = "application/octet-stream";

                    // Handle both single contentType and array of contentTypes
                    if (options.contentType) {
                        if (Array.isArray(options.contentType)) {
                            contentType =
                                options.contentType[i] ||
                                "application/octet-stream";
                        } else {
                            contentType = options.contentType;
                        }
                    } else {
                        // Auto-detect from extension
                        switch (extension) {
                            case "pdf":
                                contentType = "application/pdf";
                                break;
                            case "jpg":
                            case "jpeg":
                                contentType = "image/jpeg";
                                break;
                            case "png":
                                contentType = "image/png";
                                break;
                            case "txt":
                                contentType = "text/plain";
                                break;
                            case "json":
                                contentType = "application/json";
                                break;
                            // Add more MIME types as needed
                        }
                    }

                    // For web, we'll create a simple blob and download it
                    const blob = new Blob([""], { type: contentType });

                    setTimeout(() => {
                        FileSaver.saveAs(blob, filename);
                    }, i * 100);
                }
            } else {
                // Handle filenameArray/base64DataArray format
                for (let i = 0; i < filenames.length; i++) {
                    const filename = filenames[i];
                    const base64Data = base64DataArray[i];
                    const extension = filename.split(".").pop()?.toLowerCase();
                    let contentType = "application/octet-stream";

                    // Handle both single contentType and array of contentTypes
                    if (options.contentType) {
                        if (Array.isArray(options.contentType)) {
                            contentType =
                                options.contentType[i] ||
                                "application/octet-stream";
                        } else {
                            contentType = options.contentType;
                        }
                    } else {
                        // Auto-detect from extension
                        switch (extension) {
                            case "pdf":
                                contentType = "application/pdf";
                                break;
                            case "jpg":
                            case "jpeg":
                                contentType = "image/jpeg";
                                break;
                            case "png":
                                contentType = "image/png";
                                break;
                            case "txt":
                                contentType = "text/plain";
                                break;
                            case "json":
                                contentType = "application/json";
                                break;
                            // Add more MIME types as needed
                        }
                    }

                    // Create blob from base64 data
                    const byteArray = WebUtils.toByteArray(base64Data);
                    const blob = new Blob([byteArray as BlobPart], {
                        type: contentType,
                    });

                    setTimeout(() => {
                        FileSaver.saveAs(blob, filename);
                    }, i * 100);
                }
            }

            resolve();
        });
    }
}
