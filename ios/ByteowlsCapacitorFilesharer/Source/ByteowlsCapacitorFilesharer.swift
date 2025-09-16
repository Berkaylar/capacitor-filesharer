import Foundation
import Capacitor

@objc(FileSharerPlugin)
public class FileSharerPlugin: CAPPlugin {

    let PARAM_FILENAME = "filename"
    let PARAM_BASE64_DATA = "base64Data"

    let ERR_PARAM_NO_FILENAME = "ERR_PARAM_NO_FILENAME"
    let ERR_PARAM_NO_DATA = "ERR_PARAM_NO_DATA"
    let ERR_PARAM_DATA_INVALID = "ERR_PARAM_DATA_INVALID"
    let ERR_FILE_CACHING_FAILED = "ERR_FILE_CACHING_FAILED"

    @objc func share(_ call: CAPPluginCall) {
        guard let filename = call.getString(self.PARAM_FILENAME) else {
            call.reject(self.ERR_PARAM_NO_FILENAME)
            return
        }
        guard let base64Data = call.getString(self.PARAM_BASE64_DATA) else {
            call.reject(self.ERR_PARAM_NO_DATA)
            return
        }

        let tmpUrl = FileManager.default.temporaryDirectory.appendingPathComponent(filename)

        guard let dataObj = Data(base64Encoded: base64Data) else {
            call.reject(self.ERR_PARAM_DATA_INVALID)
            return
        }

        do {
            try dataObj.write(to: tmpUrl)

            DispatchQueue.main.async {
                let activityVC = UIActivityViewController(activityItems: [tmpUrl], applicationActivities: nil)
                // must be on the main thread
                let capacitorView = self.bridge?.viewController?.view

                // On iPhones the activity is shown as modal
                // On iPads on the other side it must be a popover by providing either a (sourceView AND sourceRect) OR a barButtonItem.
                activityVC.popoverPresentationController?.sourceView = capacitorView
                activityVC.popoverPresentationController?.sourceRect =
                    CGRect(x: capacitorView?.center.x ?? 0,
                           y: capacitorView?.bounds.size.height ?? 0,
                           width: 0,
                           height: 0)

                self.bridge?.viewController?.present(activityVC, animated: true, completion: {
                    call.resolve()
                })
            }
        } catch {
            call.reject(self.ERR_FILE_CACHING_FAILED)
        }
    }

    @objc func shareMultiple(_ call: CAPPluginCall) {
        var tmpUrls: [URL] = []
        
        // Check if using the new files format (Android/Web)
        if let files = call.getArray("files", String.self) {
            for filePath in files {
                let tmpUrl: URL
                
                // Check if it's already a file URL or a file path
                if filePath.hasPrefix("file://") {
                    tmpUrl = URL(string: filePath)!
                } else if filePath.hasPrefix("content://") {
                    // For content URIs, we need to handle them differently
                    // For now, we'll try to create a file URL
                    tmpUrl = URL(string: filePath)!
                } else {
                    // It's a file path, create a file URL
                    tmpUrl = URL(fileURLWithPath: filePath)
                }
                
                // Check if file exists
                if !FileManager.default.fileExists(atPath: tmpUrl.path) {
                    call.reject("File not found: \(filePath)")
                    return
                }
                
                tmpUrls.append(tmpUrl)
            }
        }
        // Check if using the old filenameArray/base64DataArray format (iOS compatibility)
        else if let filenameArray = call.getArray("filenameArray", String.self),
                let base64DataArray = call.getArray("base64DataArray", String.self) {
            
            // Ensure arrays are the same length
            guard filenameArray.count == base64DataArray.count else {
                call.reject("Array length mismatch")
                return
            }
            
            for (index, base64Data) in base64DataArray.enumerated() {
                let filename = filenameArray[index]
                let tmpUrl = FileManager.default.temporaryDirectory.appendingPathComponent(filename)
                
                guard let dataObj = Data(base64Encoded: base64Data) else {
                    call.reject(self.ERR_PARAM_DATA_INVALID)
                    return
                }
                
                do {
                    try dataObj.write(to: tmpUrl)
                    tmpUrls.append(tmpUrl)
                } catch {
                    call.reject(self.ERR_FILE_CACHING_FAILED)
                    return
                }
            }
        } else {
            call.reject(self.ERR_PARAM_NO_FILENAME)
            return
        }

        DispatchQueue.main.async {
            let activityVC = UIActivityViewController(activityItems: tmpUrls, applicationActivities: nil)
            // must be on the main thread
            let capacitorView = self.bridge?.viewController?.view

            // On iPhones the activity is shown as modal
            // On iPads on the other side it must be a popover by providing either a (sourceView AND sourceRect) OR a barButtonItem.
            activityVC.popoverPresentationController?.sourceView = capacitorView
            activityVC.popoverPresentationController?.sourceRect =
                CGRect(x: capacitorView?.center.x ?? 0,
                       y: capacitorView?.bounds.size.height ?? 0,
                       width: 0,
                       height: 0)

            self.bridge?.viewController?.present(activityVC, animated: true, completion: {
                call.resolve()
            })
        }
    }

}
