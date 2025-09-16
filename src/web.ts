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

            let blob = new Blob([WebUtils.toByteArray(options.base64Data!)], {
                type: options.contentType,
            });
            FileSaver.saveAs(blob, options.filename);
            resolve();
        });
    }

    async shareMultiple(options: ShareMultipleFileOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!options.filenameArray || options.filenameArray.length === 0) {
                reject(new Error("ERR_PARAM_NO_FILENAME"));
            } else if (
                !options.base64DataArray ||
                options.base64DataArray.length === 0
            ) {
                reject(new Error("ERR_PARAM_NO_DATA"));
            } else if (
                options.filenameArray.length !== options.base64DataArray.length
            ) {
                reject(new Error("ERR_PARAM_ARRAY_LENGTH_MISMATCH"));
            }

            // For web, we'll download each file individually
            // In a real implementation, you might want to create a zip file or handle this differently
            for (let i = 0; i < options.filenameArray.length; i++) {
                const filename = options.filenameArray[i];
                const base64Data = options.base64DataArray[i];

                // Determine content type from filename extension
                const extension = filename.split(".").pop()?.toLowerCase();
                let contentType = "application/octet-stream";

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

                const blob = new Blob([WebUtils.toByteArray(base64Data)], {
                    type: contentType,
                });

                // Add a small delay between downloads to avoid browser blocking
                setTimeout(() => {
                    FileSaver.saveAs(blob, filename);
                }, i * 100);
            }

            resolve();
        });
    }
}
