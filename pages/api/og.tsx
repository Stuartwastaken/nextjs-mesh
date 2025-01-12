import React from "react";
import { ImageResponse } from "next/og";
import pako from "pako";

export const config = {
  runtime: "nodejs", 
  // If you really want "edge", note that Node built-ins won't work.
  // pako, however, is fine on the Edge runtime. 
};

/**
 * Decompress a Base64-encoded zlib string using pako.
 * This works in both Node.js and Edge environments without built-in zlib.
 */
function decompressBase64ZlibEdge(base64String: string): string {
  // Convert base64 to a Uint8Array of compressed bytes.
  const compressedBytes = Uint8Array.from(atob(base64String), (c) =>
    c.charCodeAt(0)
  );
  // Decompress the bytes with pako.
  const decompressedBytes = pako.inflate(compressedBytes);
  // Convert the decompressed bytes back to a UTF-8 string.
  return new TextDecoder().decode(decompressedBytes);
}

export default async function handler(req: Request) {
  // Construct a URL from the incoming request so we can parse query params.
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
    imageUrl = decompressBase64ZlibEdge(encodedPfp);
    console.log("Decompressed pfp URL:", imageUrl);
  } catch (err) {
    console.error("Failed to decompress pfp:", err);
    // Fallback to "na" or some placeholder
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

    if (!imageUrl || imageUrl === "na") {
      throw new Error("No valid imageUrl to fetch.");
    }

    // Fetch the image from the decompressed URL
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
