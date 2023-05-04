//
//  File.swift
//  Browsernaut
//
//  Created by Billy Jacoby on 4/23/23.
//

import SwiftRs
import Foundation
import AppKit
import Cocoa

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

extension NSImage {
    var base64String: String? {
        guard let rep = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: Int(size.width),
            pixelsHigh: Int(size.height),
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .calibratedRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
            ) else {
                print("Couldn't create bitmap representation")
                return nil
        }

        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
        draw(at: NSZeroPoint, from: NSZeroRect, operation: .sourceOver, fraction: 1.0)
        NSGraphicsContext.restoreGraphicsState()

        guard let data = rep.representation(using: NSBitmapImageRep.FileType.png, properties: [NSBitmapImageRep.PropertyKey.compressionFactor: 1.0]) else {
            print("Couldn't create PNG")
            return nil
        }

        // With prefix
         return "data:image/png;base64,\(data.base64EncodedString(options: []))"
    }
}

@_cdecl("get_app_icon")
public func getAppIcon(appName: SRString, size: Int = 256) -> SRString? {
    
    if let path = NSWorkspace.shared.fullPath(forApplication: appName.toString()) {
        if let rep = NSWorkspace.shared.icon(forFile: path)
            .bestRepresentation(for: NSRect(x: 0, y: 0, width: size, height: size), context: nil, hints: nil) {
            
            let image = NSImage(size: rep.size)
            image.addRepresentation(rep)
            
            return SRString(image.base64String ?? "")
        }
    }
    
    return SRString("")

}
