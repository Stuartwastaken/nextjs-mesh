// pages/api/og.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import pako from "pako";
import {getExifOrientation} from "../../lib/validations/utils/getExifOrientation";


// 2) Basic orientation -> CSS transform
function orientationToTransform(orientation: number): string {
  switch (orientation) {
    case 3:
      return "rotate(180deg)";
    case 6:
      return "rotate(90deg)";
    case 8:
      return "rotate(-90deg)";
    default:
      return "none";
  }
}

/**
 * Decompress a Base64-encoded zlib (deflated) string using pako.
 */
function decompressBase64Zlib(base64String: string): string {
  const compressedBytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const decompressedBytes = pako.inflate(compressedBytes);
  return new TextDecoder().decode(decompressedBytes);
}

/**
 * Checks size -> fallback
 */
function checkMaxSizeOrFallback(bufferSize: number, name: string, maxBytes: number = 1_000_000) {
  if (bufferSize > maxBytes) {
    return new ImageResponse(
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
      </div>,
      { width: 600, height: 400 }
    );
  }
  return null;
}

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
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
    imageUrl = "na";
  }

  // Decide the top/bottom text
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

  if (!imageUrl || imageUrl === "na") {
    return new ImageResponse(
      <div style={{  }}>Error: No valid image URL</div>,
      { width: 600, height: 400 }
    );
  }

  // Try fetching the image to parse orientation
  let orientation = 1;
  try {
    const resp = await fetch(imageUrl);
    if (!resp.ok) throw new Error(`status = ${resp.status}`);

    const buffer = await resp.arrayBuffer();
    const fallbackLarge = checkMaxSizeOrFallback(buffer.byteLength, name, 1_000_000);
    if (fallbackLarge) return fallbackLarge;

    orientation = getExifOrientation(buffer);
  } catch (err) {
    orientation = 1; // fallback
  }

  const transformStyle = orientationToTransform(orientation);

  // Optional custom font
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await fetch(new URL("../../public/TYPEWR__.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer()
    );
  } catch (fontError) {
    // ignore
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
        {/* Blurred background with orientation fix */}
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

        {/* Center round avatar */}
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
