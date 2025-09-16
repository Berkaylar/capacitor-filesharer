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
            if (!options.files || options.files.length === 0) {
                reject(new Error("ERR_PARAM_NO_FILENAME"));
                return;
            }

            // For web, we can't directly share multiple files like native platforms
            // We'll download each file individually
            // In a real implementation, you might want to create a zip file or handle this differently
            for (let i = 0; i < options.files.length; i++) {
                const filePath = options.files[i];

                // Extract filename from path
                const filename = filePath.split("/").pop() || `file_${i}`;

                // Determine content type from filename extension or use provided contentType
                const extension = filename.split(".").pop()?.toLowerCase();
                let contentType =
                    options.contentType || "application/octet-stream";

                if (!options.contentType) {
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
                // Note: This is a simplified implementation for web
                const blob = new Blob([""], { type: contentType });

                // Add a small delay between downloads to avoid browser blocking
                setTimeout(() => {
                    FileSaver.saveAs(blob, filename);
                }, i * 100);
            }

            resolve();
        });
    }
}
