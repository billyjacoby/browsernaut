//
//  File.swift
//  Browsernaut
//
//  Created by Billy Jacoby on 4/23/23.
//

import SwiftRs
import Foundation
import AppKit

@_cdecl("get_default_browser")
public func getDefaultAppURL() -> SRString? {
    let url =  LSCopyDefaultApplicationURLForURL(URL(string: "https://google.com")! as CFURL, .all, nil)?.takeRetainedValue() as URL?
    return SRString(url?.lastPathComponent ?? "")
    
}

@_cdecl("set_default_browser")
public func setDefaultBrowser() -> Bool {
    let result = LSSetDefaultHandlerForURLScheme("http" as CFString, "com.billyjacoby.browsernaut" as CFString)
    if (result == 0) {
        return true
    } else {
        return false
    }
    
}

// TODO: implement function to get app icons for installed apps
@_cdecl("get_file_thumbnail_base64")
func getFileThumbnailBase64(path: SRString) -> SRString {
    let path = path.toString();
    
    let image = NSWorkspace.shared.icon(forFile: path)
    let bitmap = NSBitmapImageRep(data: image.tiffRepresentation!)!.representation(using: .png, properties: [:])!
    
    return SRString(bitmap.base64EncodedString())
}
