import Image from "next/image";
import qrCodeImage from "../public/qr_code_barcode.png";
import { useRouter } from "next/router"; // Import the useRouter hook
import Head from 'next/head'; // Make sure to import Head for setting head elements

export default function Home() {
  const router = useRouter(); // Initialize the useRouter hook
  // Extract the username from the query parameters
  const { username } = router.query;

  // If there's no username, you can decide to set a default one or handle it differently
  const defaultUsername = 'defaultUsername';
  const effectiveUsername = username || defaultUsername;

  const baseUrl = 'https://nextjs-mesh-seven.vercel.app/';
  const ogImageUrl = `${baseUrl}/api/og?username=${effectiveUsername}`;

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
