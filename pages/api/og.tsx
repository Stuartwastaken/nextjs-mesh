import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  try {
    const res = await fetch(`https://github.com/${username}.png`);
    if (!res.ok) {
      throw new Error(`Failed to fetch GitHub image for user ${username}`);
    }
    const imageBuffer = await res.arrayBuffer();
    // If image fetch is successful, proceed to return the image response
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'black',
            background: '#f6f6f6',
            width: '100%',
            height: '100%',
            paddingTop: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            width="256"
            height="256"
            src={`https://github.com/${username}.png`}
            style={{
              borderRadius: 128,
            }}
          />
          <p>github.com/{username}</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
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
