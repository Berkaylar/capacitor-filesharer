import { WebPlugin } from "@capacitor/core";
import type { FileSharerPlugin, ShareFileOptions, ShareMultipleFileOptions } from "./definitions";
export declare class FileSharerPluginWeb extends WebPlugin implements FileSharerPlugin {
    share(options: ShareFileOptions): Promise<void>;
    shareMultiple(options: ShareMultipleFileOptions): Promise<void>;
}
