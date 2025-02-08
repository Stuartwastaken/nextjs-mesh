import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { generateQRCode } from "../lib/validations/utils/generateQRCode";
import { decompressBase64Zlib } from "@/lib/validations/utils/decompressBase64Zlib";
import AcceptReferral from "./components/AcceptReferral";

import { Poppins } from "next/font/google";
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

type HomeProps = {
  userRef: string;
  location: string;
  pfp: string;
  name: string;
  route: string;
  referralHash: string;
};

export default function Home({
  userRef,
  location,
  pfp,
  name,
  route,
  referralHash,
}: HomeProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const baseUrl = "https://nextjs-mesh-seven.vercel.app";

  // Use a static image for the invitedConfirm and referAFriend routes.
  const ogImageUrl =
    route === "invitedConfirm"
      ? "/mesh_invite_two.png"
      : route === "referAFriend"
      ? "/refer_a_friend.png"
      : `${baseUrl}/api/og?` +
        `pfp=${encodeURIComponent(pfp)}&` +
        `name=${encodeURIComponent(name)}&` +
        `userRef=${encodeURIComponent(userRef)}&` +
        `referralHash=${encodeURIComponent(referralHash)}&` +
        `route=${encodeURIComponent(route)}`;

  useEffect(() => {
    let deepLinkURL = "";

    if (route === "invitedConfirm") {
      deepLinkURL =
        `mesh://meshapp.us/invitedConfirm?` +
        `userRef=${userRef}&` +
        `location=${location}&` +
        `pfp=${pfp}&` +
        `name=${name}`;
    } else if (route === "acceptReferral") {
      deepLinkURL =
        `mesh://meshapp.us/acceptReferral?` +
        `name=${name}&` +
        `userRef=${userRef}&` +
        `referralHash=${referralHash}`;
    } else {
      deepLinkURL =
        `mesh://meshapp.us/${route}?` +
        `userRef=${userRef}&` +
        `location=${location}&` +
        `pfp=${pfp}&` +
        `name=${name}`;
    }

    // For all routes except "acceptReferral", generate the QR code and auto-redirect.
    if (route !== "acceptReferral") {
      generateQRCode(deepLinkURL).then((img) => setQrCodeImage(img));

      if (typeof window !== "undefined" && window.location.protocol !== "mesh:") {
        window.location.href = deepLinkURL;
      }
    }
  }, [userRef, location, pfp, name, route, referralHash]);

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
        <h1 className={`${poppins.className} text-6xl font-bold mb-12 uppercase`}>
          Mesh
        </h1>

        <div className="flex flex-col items-center justify-center mb-12">
          {route === "acceptReferral" ? (
            <AcceptReferral name={name} userRef={userRef} referralHash={referralHash} />
          ) : qrCodeImage ? (
            <Image src={qrCodeImage} alt="QR Code" width={600} height={600} className="mb-4" />
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
        {route !== "acceptReferral" && (
          <p className="text-xl font-light">PLEASE SCAN ON YOUR MOBILE</p>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const userRef = (context.query.userRef as string) || "na";
  const location = (context.query.location as string) || "na";
  const pfp = (context.query.pfp as string) || "na";
  const name = (context.query.name as string) || "na";
  const route = (context.query.route as string) || "na";
  const referralHash = (context.query.referralHash as string) || "na";

  return {
    props: { userRef, location, pfp, name, route, referralHash },
  };
};
