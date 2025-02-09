import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import { getExifOrientation } from "../../lib/validations/utils/getExifOrientation";
import { decompressBase64Zlib } from "@/lib/validations/utils/decompressBase64Zlib";
import { orientationToTransform } from "@/lib/validations/utils/orientationToTransform";

/**
 * Checks size -> fallback
 */
function checkMaxSizeOrFallback(
  bufferSize: number,
  name: string,
  maxBytes: number = 8_000_000
) {
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

  // Extract query parameters
  const name = searchParams.get("name") ?? "na";
  const route = searchParams.get("route") ?? "na";
  const encodedPfp = searchParams.get("pfp") ?? "na";
  const userRef = searchParams.get("userRef") ?? "na";
  const referralHash = searchParams.get("referralHash") ?? "na";

  // Define dynamic dimensions based on the route
  let width = 630;
  let height = 1200;

  if (route === "referAFriend") {
    width = 800;
    height = 800;
  }

  // Serve static image for the referAFriend route
  if (route === "referAFriend") {
    const staticImageUrl = new URL(
      "../../public/refer_a_friend.png",
      import.meta.url
    );
    const staticImageRes = await fetch(staticImageUrl);
    if (!staticImageRes.ok) {
      return new Response("Failed to load static image", { status: 500 });
    }
    const imageBuffer = await staticImageRes.arrayBuffer();
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Decode the profile picture URL
  let imageUrl = "";
  try {
    imageUrl = decompressBase64Zlib(encodedPfp);
  } catch (error) {
    imageUrl = "na";
  }

  // Define text content based on the route
  let topText = "";
  let bottomText = "";

  if (route === "invitedConfirm") {
    topText = "Accept Invite Request";
    bottomText = `${name}, We are inviting you to coffee this Saturday`;
  } else if (route === "acceptReferral") {
    topText = `VIP Invite from ${name}`;
    bottomText = `Join me here on Mesh! You can thank me later ;)`;
  } else {
    topText = `VIP Invite from ${name}`;
    bottomText = `Join me here on Mesh! You can thank me later ;)`;
  }

  // Handle missing or invalid image URLs
  if (!imageUrl || imageUrl === "na") {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          color: "white",
          background: "black",
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        Error: No valid image URL
      </div>,
      { width, height }
    );
  }

  // Fetch and process the image
  let orientation = 1;
  try {
    const resp = await fetch(imageUrl);
    if (!resp.ok) throw new Error(`status = ${resp.status}`);
    const buffer = await resp.arrayBuffer();

    // Check image size
    const fallbackLarge = checkMaxSizeOrFallback(buffer.byteLength, name, 8_000_000);
    if (fallbackLarge) return fallbackLarge;

    // Get EXIF orientation
    orientation = getExifOrientation(buffer);
  } catch (err) {
    orientation = 1; // Default orientation
  }

  // Apply orientation transformation
  const transformStyle = orientationToTransform(orientation);

  // Load custom font (optional)
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await fetch(new URL("../../public/TYPEWR__.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer()
    );
  } catch (fontError) {
    console.warn("Failed to load custom font. Falling back to system font.");
  }

  // Generate the Open Graph image
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: `${width}px`,
          height: `${height}px`,
          color: "#FFF",
          backgroundColor: "gray",
        }}
      >
        {/* Background image */}
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

        {/* Top text */}
        <div
          style={{
            fontSize: route === "referAFriend" ? "64px" : "72px",
            fontWeight: 700,
            marginBottom: "100px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {topText}
        </div>

        {/* Profile picture */}
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

        {/* Bottom text */}
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
      width,
      height,
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