import Image from "next/image";
import qrCodeImage from "../public/qr_code_barcode.png";
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type HomeProps = {
  userRef: string; // userRef
  outingType: string; // coffee, dinner, or drinks
  pfp: string // url of image
  name: string; // user's name
  route: string; // lobbytn lobbytom accept friend req
};

export default function Home({ userRef, outingType, pfp, name, route }: HomeProps) {
  const baseUrl = 'https://nextjs-mesh-seven.vercel.app/';
  const ogImageUrl = `${baseUrl}/api/og?` +
  `outingType=${encodeURIComponent(outingType)}&` +
  `pfp=${encodeURIComponent(pfp)}&` +
  `name=${encodeURIComponent(name)}&` +
  `route=${encodeURIComponent(route)}`;
  const router = useRouter();

  useEffect(() => {
    // needs outing type
    // Perform the redirect only in the browser
    if (typeof window !== 'undefined' && window.location.protocol !== 'mesh:') {
      const deepLinkURL = `mesh://nextjs-mesh-seven.vercel.app/${route}?userRef=${userRef}`;
      window.location.href = deepLinkURL;
    }
  }, [userRef]);

  return (
    <>
      <Head>
        <title>Mesh.</title>
        <meta property="og:title" content="Mesh. Four People Together" />
        <meta property="og:description" content="Connect and collaborate on Mesh." />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="630" />
        <meta property="og:image:height" content="1200" />
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const username = context.query.username as string || 'na';
  const outingType = context.query.outingType as string || 'na';
  const pfp = context.query.pfp as string || 'na';
  const name = context.query.name as string || 'na';
  const route = context.query.route as string || 'na';

  return {
    props: {
      username,
      outingType,
      pfp,
      name,
      route,
    },
  };
};

