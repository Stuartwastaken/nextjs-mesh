import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mesh.</title>
        <meta
          property="og:image"
          content="https://images.squarespace-cdn.com/content/v1/5d016c1ba9f2e7000120c08c/1560579210527-7LDCZH62S91OLOJIKAE9/AdobeStock_87517185.jpeg?format=1000w"
        />
        <meta property="og:description" content="Dog website" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="500" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Mesh. Four People Together</h1>
      </main>
    </>
  );
}
