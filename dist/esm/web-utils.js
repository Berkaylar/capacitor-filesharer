// import sha256 from "fast-sha256";
export class WebUtils {
    static toByteArray(base64Data) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Uint8Array(byteNumbers);
    }
}
//# sourceMappingURL=web-utils.js.map