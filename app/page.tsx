import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mesh.</title>
        <meta property="og:title" content="Mesh. Four People Together" />
        <meta property="og:description" content="Dog website" />
        <meta 
          property="og:image" 
          content="https://nextjs-mesh-seven.vercel.app/dog.png" 
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="919" /> {/* Consider adjusting these dimensions */}
        <meta property="og:image:height" content="1280" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Mesh. Four People Together</h1>
      </main>
    </>
  );
}
