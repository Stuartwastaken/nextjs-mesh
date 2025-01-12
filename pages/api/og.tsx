import type { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "next/og";
import React from "react";
import pako from "pako";

export const config = {
  runtime: "nodejs",
};

/**
 * Decompress a Base64-encoded zlib (deflated) string using pako.
 * Returns the original uncompressed string (e.g., a URL).
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Grab all query params from req.query
    const {
      name = "na",
      route = "na",
      pfp = "na",
      userRef = "na",
      referralHash = "na",
    } = req.query;

    // Decompress the pfp from base64+zlib
    let imageUrl = "";
    try {
      const pfpString = Array.isArray(pfp) ? pfp[0] : pfp;
      imageUrl = decompressBase64ZlibEdge(pfpString);
      console.log("Decompressed pfp URL:", imageUrl);
    } catch (err) {
      console.error("Failed to decompress pfp:", err);
      imageUrl = "na";
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

    // Load a custom font if needed (optional)
    const fontData = await fetch(
      new URL("../../public/TYPEWR__.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    // Fallback if no valid image URL
    if (!imageUrl || imageUrl === "na") {
      console.error("No valid imageUrl to fetch.");
      const fallback = new ImageResponse(
        <>Error: No valid image URL for user {name}</>,
        { width: 600, height: 400 }
      );
      // Convert fallback to binary
      if (!fallback.body) {
        return res.status(500).send("No fallback body returned.");
      }
      const fallbackBuffer = await readImageResponseBody(fallback);
      return sendImageBuffer(res, fallbackBuffer);
    }

    console.log("Attempting to fetch user image at:", imageUrl);
    const fetchedImg = await fetch(imageUrl);
    if (!fetchedImg.ok) {
      throw new Error(
        `Failed to fetch profile image for user ${name}. Status: ${fetchedImg.status}`
      );
    }

    // Convert fetched image to dataUrl so we can blur it in the background
    const buffer = await fetchedImg.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64Data}`;

    // Construct the dynamic OG image
    const imageResponse = new ImageResponse(
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

    // Convert ImageResponse to a binary buffer
    if (!imageResponse.body) {
      // If somehow there's no body at all
      return res.status(500).send("ImageResponse body is null or undefined.");
    }
    const imageBuffer = await readImageResponseBody(imageResponse);

    // Send it
    return sendImageBuffer(res, imageBuffer);
  } catch (error) {
    console.error("Error in OG image generation:", error);
    return res.status(500).send("Failed to generate OG image");
  }
}

/**
 * Reads the chunks from an ImageResponse.body (a ReadableStream) and returns a Buffer.
 */
async function readImageResponseBody(imageResponse: ImageResponse): Promise<Buffer> {
  const reader = imageResponse.body!.getReader();
  const chunks: Buffer[] = [];

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      // 'value' is a Uint8Array, so convert to Node Buffer
      const nodeBuf = Buffer.from(value);
      chunks.push(nodeBuf);
    }
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

/**
 * Helper to send a Buffer as a PNG image response.
 */
function sendImageBuffer(res: NextApiResponse, buffer: Buffer) {
  res.setHeader("Content-Type", "image/png");
  res.status(200).send(buffer);
}
