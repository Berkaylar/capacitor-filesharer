import {WebPlugin,registerPlugin} from '@capacitor/core';
import {FileSharerPlugin, ShareFileOptions} from "./definitions";
import * as FileSaver from 'file-saver';

export class FileSharerPluginWeb extends WebPlugin implements FileSharerPlugin {

    constructor() {
        super({
            name: 'FileSharer',
            platforms: ['web']
        });
    }

    async share(options: ShareFileOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            let blob = new Blob(
                [ this.toByteArray(options.base64Data) ],
                {type: options.contentType}
                );
            FileSaver.saveAs(blob, options.filename);
            resolve();
        });
    }

    toByteArray(base64Data: string): Uint8Array {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
    }
}


// this does not work for angular. You need to register the plugin in app.component.ts again.
const FileSharer = registerPlugin<FileSharerPluginWeb>('FileSharer', {
    web: () => import('./web').then(m => new m.FileSharerPluginWeb()),
});
export { FileSharer };
