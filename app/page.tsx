import Image from "next/image";
import qrCodeImage from "../public/qr_code_barcode.png";
import Head from 'next/head';

type HomeProps = {
  username: string;
};

export default function Home({ username }: HomeProps) {
  const baseUrl = 'https://nextjs-mesh-seven.vercel.app/';
  const ogImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}`;

  return (
    <>
      <Head>
        <title>Mesh.</title>
        <meta property="og:title" content="Mesh. Four People Together" />
        <meta property="og:description" content="Connect and collaborate on Mesh." />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
      </Head>
      <main className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-8 p-48">
        <div className="triangleTag" />
        <h1 className="customFont text-6xl font-bold mb-12 uppercase">
          Mesh
        </h1>
        <div className="flex flex-col items-center justify-center mb-12">
          <Image src={qrCodeImage} alt="QR Code" width={600} className="mb-4" />
        </div>
        <p className="text-xl font-light">PLEASE SCAN ON YOUR MOBILE</p>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  // Extract the username from the query parameters
  const { query } = context;
  const username = query.username || 'defaultUsername'; // Provide a default username if none is provided
  
  return {
    props: {
      username,
    },
  };
}
