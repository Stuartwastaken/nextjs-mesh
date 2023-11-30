import { ImageResponse } from '@vercel/og';
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  try {
    const imageUrl = "https://avatars.githubusercontent.com/u/88628337?v=4";
    const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '50px', 
            boxSizing: 'border-box',
            color: '#000', 
            fontFamily: 'Arial, sans-serif',
            background: "#ccd8eb",
            fontSize: '16px',
            fontWeight: 'bolder',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Stuart</div>

          <img
            src={`data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`}
            alt="Profile"
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '5px solid #000',
            }}
          />

          <div style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '20px' }}>Join me on Mesh Tonight!</div>
        </div>
      ),
      {
        width: 550,
        height: 750,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
