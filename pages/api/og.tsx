import { ImageResponse } from 'next/og';

export const config = {
  runtime: 'experimental-edge',
};

// This should be the default export
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  try {
    const imageUrl = `https://github.com/${username}.png`;
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image for user ${username}`);
    
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    // Proceed to return the image response
    return new ImageResponse(
      (
        <div style={{
          position: 'relative',
          display: 'flex', // This is required by ImageResponse
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '630px',  // For a vertical layout
          height: '1200px', // For a vertical layout
        }}>
          {/* Blurred background */}
          <img
            src={imageUrl}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(50px)', // Apply blur
              zIndex: 1,
            }}
          />
          {/* Central sharp image */}
          <img
            src={imageUrl}
            style={{
              width: '256px',
              height: '256px',
              borderRadius: '50%',
              objectFit: 'cover',
              zIndex: 2, // Above the blurred background
            }}
          />
        </div>
      ),
      {
        width: 630,   // Adjusted for vertical layout
        height: 1200, // Adjusted for vertical layout
      }
    );
  } catch (error) {

    console.error(error);
    // Return an error image response or handle the error as appropriate
    return new ImageResponse(<>Error: Failed to fetch image for user {username}</>, {
      width: 1200,
      height: 630,
    });
  }
}
