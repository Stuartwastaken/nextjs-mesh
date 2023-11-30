// pages/api/ogp-image.js
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req) {
  try {
    // Extracting the user's name and the image URL from the query parameters.
    // You would have your own validation and parsing logic here.
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'Stuart Ray';
    const imageUrl = searchParams.get('image') || 'https://firebasestorage.googleapis.com/v0/b/mesh-8f209.appspot.com/o/users%2Fu8REO6psKYUtSt6To23GdyHs68w2%2Fuploads%2F1674106437989398.jpg?alt=media&token=4181015c-a024-47dc-86dc-7b483900c04c';

    // Fetch the image from the URL.
    const imageArrayBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
                    <img src={'https://firebasestorage.googleapis.com/v0/b/mesh-8f209.appspot.com/o/users%2Fu8REO6psKYUtSt6To23GdyHs68w2%2Fuploads%2F1674106437989398.jpg?alt=media&token=4181015c-a024-47dc-86dc-7b483900c04c'} alt="Profile" height={250} width={250} />
      
        <div style={{ marginTop: 40 }}>Join Stuart Ray Tonight</div>
      </div>
      ),
      {
        width: 1200,
        height: 630,
        // Define additional properties if needed
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
