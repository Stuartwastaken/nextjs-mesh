import Head from "next/head";
import dogImage from "../public/dog.png";
import Image from "next/image"; 

export default function Home() {
  return (
    <>
      <title>Mesh.</title>
      <Head>
        <meta
          property="og:image"
          content= "https://nextjs-mesh-seven.vercel.app/dog.png"
        />
        <meta property="og:description" content="Dog website" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="919" />
        <meta property="og:image:height" content="1280" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Mesh. Four People Together</h1>
        {/* <img src="https://nextjs-mesh-seven.vercel.app/dog.JPG" alt="Dog" /> */}
        <Image src= "https://nextjs-mesh-seven.vercel.app/dog.png" alt="Dog" width={919} height={1280} />
      </main>
    </>
  );
}
