import { ImageResponse } from "next/og";
import React from "react";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;


  const name = searchParams.get("name") || 'na';
  const route = searchParams.get("route") || 'na';
  const imageUrl = searchParams.get("pfp") || 'na';
  const outingType = searchParams.get("outingType") || 'na';
  // const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

  const fontData = await fetch(
    new URL("../../public/TYPEWR__.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  let lobbyTime = "tonight";

  if(route == "lobbyTomorrow"){
    lobbyTime = "tomorrow";
  }

  let topText = `Join ${name}`;
  let bottomText = `Join me for ${outingType} on Mesh ${lobbyTime}!`;


  if(route == "acceptFriendRequest"){
    topText = 'Accept Friend Request';
    bottomText = `${name} is inviting you to join Mesh!`
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image for user ${name}`);

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
            {topText}
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
    return new ImageResponse(
      <>Error: Failed to fetch image for user {name}</>,
      {
        width: 1155,
        height: 690,
      }
    );
  }
}
