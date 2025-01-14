/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import pako from "pako";
// We'll use a plain <img> in the final render
import ExifReader from "exifreader";

export const config = {
  runtime: "edge",
};

/**
 * Decompress a Base64-encoded zlib (deflated) string using pako.
 * Returns the original uncompressed string (e.g., a URL).
 */
function decompressBase64Zlib(base64String: string): string {
  const compressedBytes = Uint8Array.from(atob(base64String), (c) =>
    c.charCodeAt(0)
  );
  const decompressedBytes = pako.inflate(compressedBytes);
  return new TextDecoder().decode(decompressedBytes);
}

/**
 * Map EXIF orientation to CSS transform.
 * Here are the common orientation values:
 *   1: No rotation
 *   3: 180°
 *   6: 90° clockwise
 *   8: 270° clockwise (or 90° CCW)
 */
function orientationToTransform(orientation: number): string {
  switch (orientation) {
    case 3:
      return "rotate(180deg)";
    case 6:
      return "rotate(90deg)";
    case 8:
      return "rotate(-90deg)";
    // Some phones might use 2, 4, 5, 7 (mirroring/flips),
    // but often you only see 1,3,6,8 in the wild.
    default:
      return "none";
  }
}

/**
 * Checks if the image is under a certain size limit.
 * If it exceeds `maxBytes`, returns a fallback ImageResponse
 * to avoid embedding huge images. Otherwise returns `null` meaning "OK".
 */
function checkMaxSizeOrFallback(
  bufferSize: number,
  name: string,
  maxBytes: number = 1_000_000
) {
  if (bufferSize > maxBytes) {
    console.warn(
      `[OGP] Image is ${bufferSize} bytes, exceeding ${maxBytes}. Returning fallback.`
    );
    // Return a simple fallback ImageResponse:
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
          Error: Image too large for user {name}
        </div>
      ),
      { width: 600, height: 400 }
    );
  }
  return null; // Means "OK to proceed"
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

  let imageUrl = "";
  try {
    imageUrl = decompressBase64Zlib(encodedPfp);
  } catch (error) {
    console.error("[OGP] Failed to decompress pfp:", error);
    imageUrl = "na";
  }

  // Decide the top/bottom text based on route
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

  // If invalid URL, fallback
  if (!imageUrl || imageUrl === "na") {
    console.error(
      "[OGP] Invalid or missing imageUrl. Returning fallback image."
    );
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

  // Fetch the image so we can parse EXIF orientation and check size
  let orientation = 1; // default
  try {
    const resp = await fetch(imageUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch image. status = ${resp.status}`);
    }

    const buffer = await resp.arrayBuffer();
    // Check for size fallback
    const fallbackLarge = checkMaxSizeOrFallback(
      buffer.byteLength,
      name,
      1_000_000
    );
    if (fallbackLarge) {
      return fallbackLarge;
    }

    // 1) parse EXIF orientation
    const tags = ExifReader.load(buffer);
    // `Orientation` is often an object with `.value`
    // Default to 1 (no rotation) unless we successfully parse a number
    const orientationValue = tags.Orientation?.value;
    if (typeof orientationValue === "number") {
      orientation = orientationValue;
    } else if (typeof orientationValue === "string") {
      // Attempt to parse if it's a string like "6" or "3"
      const parsed = parseInt(orientationValue, 10);
      orientation = Number.isNaN(parsed) ? 1 : parsed;
    } else {
      orientation = 1;
    }
    console.log("[OGP] EXIF orientation =", orientation);
  } catch (err) {
    console.error("[OGP] Could not parse EXIF / fetch image:", err);
    // We won't fail entirely; we just won't rotate.
    orientation = 1;
  }

  // Convert orientation to a CSS transform
  const transformStyle = orientationToTransform(orientation);

  // (Optional) Load a custom font
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await fetch(
      new URL("../../public/TYPEWR__.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
  } catch (fontError) {
    console.warn(
      "[OGP] Could not load custom font. Continuing without it.",
      fontError
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "620px",
          height: "1155px",
          color: "#FFF",
          backgroundColor: "gray",
        }}
      >
        {/* Blurred background, apply the same rotation so the background is upright */}
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(50px)",
            zIndex: 1,
            transform: transformStyle,
            transformOrigin: "center center",
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

        {/* Center round avatar, also apply orientation fix */}
        <img
          src={imageUrl}
          alt=""
          style={{
            width: "256px",
            height: "256px",
            borderRadius: "50%",
            objectFit: "cover",
            zIndex: 3,
            transform: transformStyle,
            transformOrigin: "center center",
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
      width: 620,
      height: 1155,
      fonts: fontData
        ? [
            {
              name: "Lato",
              data: fontData,
              style: "normal",
              weight: 500,
            },
          ]
        : [],
    }
  );
}
