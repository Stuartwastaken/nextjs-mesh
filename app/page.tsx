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
          content= "https://nextjs-mesh-seven.vercel.app/dog.JPG"
        />
        <meta property="og:description" content="Dog website" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="919" />
        <meta property="og:image:height" content="1280" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Mesh. Four People Together</h1>
        {/* <img src="https://nextjs-mesh-seven.vercel.app/dog.JPG" alt="Dog" /> */}
        <Image src={dogImage.src} alt="Dog" width={600} height={500} />
      </main>
    </>
  );
}
