import { ImageResponse } from "next/og";
import { inflateSync } from "zlib"; // Built-in Node.js zlib for decompression
import React from "react";

export const config = {
  runtime: "nodejs", 
  // If you must remain on "edge" runtime, see note below on alternatives.
};

// Decompress a Base64+zlib-deflated string back to the original URL
function decompressBase64Zlib(compressed: string) {
  const compressedBuffer = Buffer.from(compressed, "base64");
  const decompressedBuffer = inflateSync(compressedBuffer);
  return decompressedBuffer.toString("utf8");
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;

  // Grab all the data from the query
  const name = searchParams.get("name") || "na";
  const route = searchParams.get("route") || "na";
  const encodedPfp = searchParams.get("pfp") || "na";
  const outingType = searchParams.get("outingType") || "na";
  const userRef = searchParams.get("userRef") || "na";
  const referralHash = searchParams.get("referralHash") || "na";

  // Decompress the pfp from base64+zlib
  let imageUrl = "";
  try {
    imageUrl = decompressBase64Zlib(encodedPfp);
    console.log("Decompressed pfp URL:", imageUrl);
  } catch (err) {
    console.error("Failed to decompress pfp:", err);
    // Fallback to a default or continue with "na"
  }

  let topText = "";
  let bottomText = "";

  if (route === "invitedConfirm") {
    topText = "Accept Invite Request";
    bottomText = `${name}, We are inviting you to coffee this Saturday.`;
  } else if (route === "acceptReferral") {
    topText = "Accept Referral";
    bottomText = `From ${name} — Referral code: ${userRef}, Hash: ${referralHash}`;
  } else {
    topText = "Welcome to Mesh";
    bottomText = `${name}`;
  }

  // Load a custom font if needed
  const fontData = await fetch(
    new URL("../../public/TYPEWR__.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  try {
    console.log("Attempting to fetch user image at:", imageUrl);

    // If imageUrl is empty or "na", fetch might fail. Adjust if you prefer a fallback.
    const fetchedImg = await fetch(imageUrl);
    if (!fetchedImg.ok) {
      throw new Error(
        `Failed to fetch profile image for user ${name}. Status: ${fetchedImg.status}`
      );
    }

    // Convert fetched image to dataUrl so we can blur it in the background
    const buffer = await fetchedImg.arrayBuffer();
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

          {/* Top text */}
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
    console.error("Error in OG image generation:", error);

    // If something went wrong (e.g. invalid imageUrl), show a fallback
    return new ImageResponse(
      <>Error: Failed to fetch image for user {name}</>,
      {
        width: 1155,
        height: 690,
      }
    );
  }
}
