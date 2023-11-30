import { ImageResponse } from '@vercel/og';
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  try {
    // Fetch the image and convert it to an array buffer.
    const imageUrl = "https://avatars.githubusercontent.com/u/88628337?v=4"; // Replace with your image URL
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
            fontSize: '16px',
            background: "#ccd8eb"
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Stuart</div>

          <img
            src={`data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`}
            alt="Profile"
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #000',
            }}
          />

          <div>Join me on Mesh Tonight!</div>
        </div>
      ),
      {
        width: 480, // Adjust width to match your preference
        height: 770, // Adjust height to match your preference
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
