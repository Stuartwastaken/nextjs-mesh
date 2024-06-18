import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { generateQRCode } from '../lib/validations/utils/generateQRCode';

type HomeProps = {
  userRef: string;
  location: string;
  pfp: string;
  name: string;
  route: string;
};

export default function Home({ userRef, location, pfp, name, route }: HomeProps) {
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const baseUrl = "https://nextjs-mesh-seven.vercel.app/";

  const ogImageUrl = route === 'invitedConfirm'
    ? '/mesh_invite.webp'
    : `${baseUrl}/api/og?` +
      `outingType=${encodeURIComponent(location)}&` +
      `pfp=${encodeURIComponent(pfp)}&` +
      `name=${encodeURIComponent(name)}&` +
      `route=${encodeURIComponent(route)}`;

  
  useEffect(() => {
    const deepLinkURL = `mesh://meshapp.us/${route}?userRef=${userRef}&location=${location}&pfp=${pfp}&name=${name}`;
    
    // Generate the QR code
    generateQRCode(deepLinkURL).then(setQrCodeImage);

    // Perform the redirect only in the browser
    if (typeof window !== 'undefined' && window.location.protocol !== 'mesh:') {
      window.location.href = deepLinkURL;
    }
  }, [userRef, location, pfp, name, route]);

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
        <h1 className="customFont text-6xl font-bold mb-12 uppercase">Mesh</h1>
        <div className="flex flex-col items-center justify-center mb-12">
          {qrCodeImage ? (
            <Image src={qrCodeImage} alt="QR Code" width={600} height={600} className="mb-4" />
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
        <p className="text-xl font-light">PLEASE SCAN ON YOUR MOBILE</p>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const username = (context.query.username as string) || 'na';
  const location = (context.query.location as string) || 'na';
  const pfp = (context.query.pfp as string) || 'na';
  const name = (context.query.name as string) || 'na';
  const route = (context.query.route as string) || 'na';
  const userRef = (context.query.userRef as string) || 'na';

  return {
    props: {
      username,
      location,
      pfp,
      name,
      route,
      userRef,
    },
  };
};
