import Head from "next/head";

export default function Home() {
  return (
    <>
      <title>Mesh.</title>
      <Head>
        <meta
          property="og:image"
          content="/public/dog.jpg"
        />
        <meta property="og:description" content="Dog website" />
        <meta property="og:image:type" content="/public/dog.jpg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="500" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Mesh. Four People Together</h1>
        {/* <img src="https://nextjs-mesh-seven.vercel.app/dog.JPG" alt="Dog" /> */}
        <img src="/public/dog.png" alt="Dog" />

      </main>
    </>
  );
}
