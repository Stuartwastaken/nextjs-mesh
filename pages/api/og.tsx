import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import pako from "pako";

export const config = {
  runtime: "edge",
};

// If you used hex before, you'd have a `fromHexString`. But here we'll do pako decompression.
function decompressBase64Zlib(base64String: string): string {
  const compressedBytes = Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const decompressedBytes = pako.inflate(compressedBytes);
  return new TextDecoder().decode(decompressedBytes);
}

export default async function handler(req: NextRequest) {
  // Similar to your older code where we do:
  //   const url = new URL(req.url);
  //   const { searchParams } = url;
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name") ?? "na";
  const route = searchParams.get("route") ?? "na";
  // pfp is your compressed base64, so let's decompress it
  const encodedPfp = searchParams.get("pfp") ?? "na";

  let imageUrl = "";
  try {
    imageUrl = decompressBase64Zlib(encodedPfp);
    console.log("Decompressed pfp URL:", imageUrl);
  } catch (error) {
    console.error("Failed to decompress pfp:", error);
    // Fallback or default to a placeholder
    imageUrl = "https://via.placeholder.com/600x400/000/fff?text=No+Image";
  }

  // Decide what top and bottom text to display
  let topText = "";
  let bottomText = "";

  if (route === "invitedConfirm") {
    topText = "Accept Invite Request";
    bottomText = `${name}, We are inviting you to coffee this Saturday`;
  } else if (route === "acceptReferral") {
    topText = "Accept Referral";
    bottomText = `From ${name}`;
  } else {
    topText = "Welcome to Mesh";
    bottomText = name;
  }

  // Optionally load a custom font
  const fontData = await fetch(
    new URL("../../public/TYPEWR__.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  try {
    console.log("Attempting to fetch image URL:", imageUrl);
    const resp = await fetch(imageUrl);
    if (!resp.ok) {
      console.error(`Failed to fetch image. Status: ${resp.status}`);
      throw new Error(`Failed to fetch image. status = ${resp.status}`);
    }

    // For the blurred background approach, we can convert to base64 (like before).
    // However, you can also just do <img src={imageUrl} ...> directly if you prefer.
    const buffer = await resp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

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
        fonts: [
          {
            name: "Lato",
            data: fontData,
            style: "normal",
            weight: 500,
          },
        ],
      }
    );
  } catch (error) {
    console.error("Failed to fetch or render image:", error);

    // Fallback OG image with error text
    return new ImageResponse(<>{`Error: Failed to fetch or render image for ${name}`}</>, {
      width: 600,
      height: 400,
    });
  }
}
