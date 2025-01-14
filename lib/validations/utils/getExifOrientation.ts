/**
 * A minimal pure-TS EXIF Orientation parser for JPEG files.
 * Returns a number 1..8 (per EXIF spec) or 1 if unknown.
 */
export function getExifOrientation(arrayBuffer: ArrayBuffer): number {
    const view = new DataView(arrayBuffer);
  
    // Check if it's a JPEG (so we look for 0xFFD8 at start)
    if (view.getUint16(0, false) !== 0xffd8) {
      return 1; // not a JPEG or no EXIF -> default to 1
    }
  
    let offset = 2; // Start after 0xFFD8
    const length = view.byteLength;
  
    while (offset < length) {
      // Every JPEG segment begins with 0xFF
      if (view.getUint16(offset, false) === 0xffe1) {
        // Found APP1 marker, next 2 bytes are the 'length' of the segment
        const segmentSize = view.getUint16(offset + 2, false);
  
        // Check if "Exif" is present in this segment:
        // 0xFFE1 segment usually starts with ASCII: "Exif\0\0"
        const exifStringOffset = offset + 4;
        const exifString = String.fromCharCode(
          view.getUint8(exifStringOffset),
          view.getUint8(exifStringOffset + 1),
          view.getUint8(exifStringOffset + 2),
          view.getUint8(exifStringOffset + 3),
          view.getUint8(exifStringOffset + 4)
        );
        if (exifString === "Exif\0") {
          // Parse the TIFF header (either big-endian or little-endian).
          // Usually starts right after "Exif\0\0", i.e. offset + 10 from the 0xffe1 start
          const tiffOffset = offset + 10;
          // Check endianness
          const endian = view.getUint16(tiffOffset, false);
          const isLittleEndian = endian === 0x4949; // 'II' => Intel
          // The first IFD (Image File Directory) offset (relative to TIFF start)
          const firstIFDOffset = view.getUint32(tiffOffset + 4, isLittleEndian);
  
          // The orientation tag is usually in the first IFD, so parse it:
          const dirStart = tiffOffset + firstIFDOffset;
          const entries = view.getUint16(dirStart, isLittleEndian);
          for (let i = 0; i < entries; i++) {
            const entryOffset = dirStart + 2 + i * 12;
            // Tag id in 2 bytes:
            const tagId = view.getUint16(entryOffset, isLittleEndian);
            if (tagId === 0x0112) {
              // Orientation tag!
              // The 'value' is in the next 2 bytes (for EXIF short).
              const orientation = view.getUint16(entryOffset + 8, isLittleEndian);
              return orientation;
            }
          }
        }
        // If not found, or not EXIF, skip ahead
        offset += 2 + segmentSize;
      } else if ((view.getUint16(offset, false) & 0xff00) === 0xff00) {
        // Some other JPEG marker
        offset += 2 + view.getUint16(offset + 2, false);
      } else {
        // No more valid segments
        break;
      }
    }
  
    return 1; // If we failed to find orientation, default is 1
  }
  