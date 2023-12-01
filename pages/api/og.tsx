import { ImageResponse } from '@vercel/og';
import { NextRequest } from "next/server";
import sharp from 'sharp';

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  try {
    const imageUrl = "https://avatars.githubusercontent.com/u/88628337?v=4";
    const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
    const fontData = await fetch(
      new URL('../../public/TYPEWR__.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Lato',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '50px',
            boxSizing: 'border-box',
            color: '#000',
            background: "#ccd8eb",
          }}
        >
          <div style={{ fontSize: '92px', fontWeight: 700, marginBottom: '20px' }}>Stuart</div>
          <div style={{ fontSize: '40px', fontWeight: 500, marginBottom: '20px' }}>Uses Mesh</div>

          <img
            src={`data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`}
            alt="Profile"
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '5px solid #000',
              marginBottom: '20px', // Added margin to space out from the text below
            }}
          />

          <div style={{ fontSize: '32px', fontWeight: 500 }}>Join me on Mesh Tonight!</div>
        </div>
      ),
      {
        width: 550,
        height: 750,
        fonts: [
          {
            name: 'Lato',
            data: fontData,
            style: 'normal',
            weight: 500,
          },
        ],
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
