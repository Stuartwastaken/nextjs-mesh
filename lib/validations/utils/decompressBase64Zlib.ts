import pako from "pako";
/**
 * Decompress a Base64-encoded zlib (deflated) string using pako.
 */
export function decompressBase64Zlib(base64String: string): string {
  const compressedBytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const decompressedBytes = pako.inflate(compressedBytes);
  return new TextDecoder().decode(decompressedBytes);
}
