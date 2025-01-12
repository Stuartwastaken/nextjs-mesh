// pages/api/og.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import pako from "pako";
import sharp from "sharp"; // NOTE: Only works on Node.js runtime

export const config = {
  // If you want to use sharp, you must be on Node.js runtime:
  runtime: "nodejs",
};

/**
 * Decompress a Base64-encoded zlib (deflated) string using pako.
 * Returns the original uncompressed string (e.g., a URL).
 */
function decompressBase64Zlib(base64String: string): string {
  console.log("decompressBase64Zlib: incoming string length =", base64String.length);
  const compressedBytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  console.log("decompressBase64Zlib: compressedBytes length =", compressedBytes.length);

  const decompressedBytes = pako.inflate(compressedBytes);
  console.log("decompressBase64Zlib: decompressedBytes length =", decompressedBytes.length);

  const url = new TextDecoder().decode(decompressedBytes);
  console.log("decompressBase64Zlib: final URL =", url);
  return url;
}

/**
 * Resizes and/or re-encodes an image buffer to ensure it stays under ~1MB.
 * You can tweak the resize width, format, or quality as needed.
 */
async function shrinkImageIfNeeded(buffer: Buffer): Promise<Buffer> {
  console.log("[OGP] shrinkImageIfNeeded: original size =", buffer.length, "bytes");
  // For example, set a width limit of 1000px, and re-encode as JPEG at 70% quality.
  let output = await sharp(buffer)
    .resize({ width: 1000, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toBuffer();

  console.log("[OGP] after first pass =>", output.length, "bytes");
  const MAX_BYTES = 1_000_000; // 1MB
  if (output.length > MAX_BYTES) {
    console.log("[OGP] still >1MB, second pass with lower quality...");
    output = await sharp(output).jpeg({ quality: 50 }).toBuffer();
    console.log("[OGP] after second pass =>", output.length, "bytes");
  }
  return output;
}

export default async function handler(req: NextRequest) {
  console.log("----- [OGP] Starting og.tsx handler -----");

  const url = new URL(req.url);
  const { searchParams } = url;

  const name = searchParams.get("name") ?? "na";
  const route = searchParams.get("route") ?? "na";
  const encodedPfp = searchParams.get("pfp") ?? "na";
  const userRef = searchParams.get("userRef") ?? "na";
  const referralHash = searchParams.get("referralHash") ?? "na";

  console.log("[OGP] Query Params ->", {
    name,
    route,
    encodedPfpLength: encodedPfp.length,
    userRef,
    referralHash,
  });

  let imageUrl = "";
  try {
    imageUrl = decompressBase64Zlib(encodedPfp);
  } catch (error) {
    console.error("[OGP] Failed to decompress pfp:", error);
    imageUrl = "na";
  }

  console.log("[OGP] route:", route);
  console.log("[OGP] final decompressed imageUrl:", imageUrl);

  let topText = "";
  let bottomText = "";

  if (route === "invitedConfirm") {
    topText = "Accept Invite Request";
    bottomText = `${name}, We are inviting you to coffee this Saturday`;
  } else if (route === "acceptReferral") {
    topText = "Accept Referral";
    bottomText = `From ${name} — Referral code: ${userRef}, Hash: ${referralHash}`;
  } else {
    topText = "Welcome to Mesh";
    bottomText = `${name}`;
  }

  console.log("[OGP] topText:", topText);
  console.log("[OGP] bottomText:", bottomText);

  // If we had a font, load it; omitted here to focus on the shrink logic.

  // If imageUrl is "na" or obviously invalid, skip fetch
  if (!imageUrl || imageUrl === "na") {
    console.error("[OGP] Invalid or missing imageUrl. Returning fallback image.");
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "white",
            background: "black",
            width: "600px",
            height: "400px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Error: No valid image URL for user {name}
        </div>
      ),
      { width: 600, height: 400 }
    );
  }

  let dataUrl = "";
  try {
    console.log("[OGP] Attempting to fetch image at:", imageUrl);
    const resp = await fetch(imageUrl);
    console.log("[OGP] fetch(imageUrl) -> status:", resp.status);

    if (!resp.ok) {
      console.error("[OGP] Image fetch not ok. Status:", resp.status, resp.statusText);
      throw new Error(`Failed to fetch image. status = ${resp.status}`);
    }

    // Convert the fetched image to a Node Buffer so we can shrink it
    const originalBuffer = Buffer.from(await resp.arrayBuffer());
    console.log("[OGP] fetched image length (arrayBuffer) =", originalBuffer.length);

    // Shrink it if needed
    const shrunkBuffer = await shrinkImageIfNeeded(originalBuffer);

    // Convert final buffer to base64 for the blurred background
    const base64 = shrunkBuffer.toString("base64");
    console.log("[OGP] final base64 length =", base64.length);

    dataUrl = `data:image/jpeg;base64,${base64}`;
  } catch (fetchError) {
    console.error("[OGP] fetchError:", fetchError);
    // If something fails in fetch or shrink, fallback
    return new ImageResponse(
      <>Error: Failed to fetch or shrink image for user {name}</>,
      { width: 600, height: 400 }
    );
  }

  console.log("[OGP] dataUrl is ready, length =", dataUrl.length);
  console.log("[OGP] Building final ImageResponse...");

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "690px",
          height: "1155px",
          color: "#FFF",
          backgroundColor: "gray",
        }}
      >
        {/* Blurred background image */}
        <img
          src={dataUrl}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(50px)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            marginBottom: "100px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {topText}
        </div>

        {/* Center round avatar */}
        <img
          src={dataUrl}
          style={{
            width: "256px",
            height: "256px",
            borderRadius: "50%",
            objectFit: "cover",
            zIndex: 3,
          }}
        />

        <div
          style={{
            fontSize: "32px",
            fontWeight: 500,
            marginTop: 200,
            textAlign: "center",
            zIndex: 4,
          }}
        >
          {bottomText}
        </div>
      </div>
    ),
    {
      width: 690,
      height: 1155,
      // If you loaded the font, pass it in here
    }
  );
}
