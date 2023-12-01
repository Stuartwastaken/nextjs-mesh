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
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: `url('${dataUrl}')`,
            filter: 'blur(8px)', // Apply blur to the background image
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)', // Optional: overlay to increase text contrast
            }}
          />
          <img
            width="256"
            height="256"
            src={imageUrl}
            style={{
              borderRadius: '50%',
              position: 'relative', // Ensure the image is above the overlay
              zIndex: 1,
            }}
          />
          {/* Other content */}
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
    // Return an error image response or handle the error as appropriate
    return new ImageResponse(<>Error: Failed to fetch image for user {username}</>, {
      width: 1200,
      height: 630,
    });
  }
}
