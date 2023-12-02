import { ImageResponse } from "next/og";
import React from "react";

export const config = {
  runtime: "experimental-edge",
};

// This should be the default export
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || 'dog';
  const imageUrl =
    searchParams.get("image") || `https://github.com/${username}.png`;
  const outingType = searchParams.get("outingType");
  const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const fontData = await fetch(
    new URL("../../public/TYPEWR__.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1155,
      height: 690,
    });
  }

  try {
    const imageUrl = `https://github.com/${username}.png`;
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image for user ${username}`);

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    // Proceed to return the image response
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
          <img
            src={imageUrl}
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
            style={{ fontSize: "92px", fontWeight: 700, marginBottom: "100px" }}
          >
            {username}
          </div>

          <img
            src={imageUrl}
            style={{
              width: "256px",
              height: "256px",
              borderRadius: "50%",
              objectFit: "cover",
              zIndex: 2,
            }}
          />

          <div style={{ fontSize: "32px", fontWeight: 500, marginTop: 200 }}>
            Join me on Mesh Tonight!
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
    return new ImageResponse(
      <>Error: Failed to fetch image for user {username}</>,
      {
        width: 1155,
        height: 690,
      }
    );
  }
}
