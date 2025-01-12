import { ImageResponse } from "next/og";
import React from "react";

export const config = {
  runtime: "edge",
};

// Decodes a hex-encoded string into a normal URL/string
function fromHexString(hexStr: string) {
  const hex = hexStr.toString();
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  console.log("Decoded pfp:", str);
  return str;
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

  // Decode the pfp from hex
  const imageUrl = fromHexString(encodedPfp);

  let topText = "";
  let bottomText = "";

  if (route === "invitedConfirm") {
    // Keep your coffee invite logic
    topText = "Accept Invite Request";
    bottomText = `${name}, We are inviting you to coffee this Saturday.`;
  } else if (route === "acceptReferral") {
    // New referral flow
    topText = "Accept Referral";
    bottomText = `From ${name} — Referral code: ${userRef}, Hash: ${referralHash}`;
  } else {
    // Some fallback if no route matches
    topText = "Welcome to Mesh";
    bottomText = `${name}`;
  }

  // Load a custom font if needed
  const fontData = await fetch(
    new URL("../../public/TYPEWR__.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  try {
    console.log("Attempting to fetch user image at:", imageUrl);
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch profile image for user ${name}. Status: ${res.status}`
      );
    }

    // Convert fetched image to dataUrl so we can blur it in the background
    const buffer = await res.arrayBuffer();
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
    console.error(error);
    // If something went wrong fetching the user image, show a fallback
    return new ImageResponse(
      <>Error: Failed to fetch image for user {name}</>,
      {
        width: 1155,
        height: 690,
      }
    );
  }
}
