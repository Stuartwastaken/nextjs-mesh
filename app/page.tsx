"use client";
import Image from "next/image";
import qrCodeImage from "../public/qr_code_barcode.png";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mesh.</title>
        <head>
          <meta property="og:title" content="Mesh. Four People Together" />
          <meta property="og:description" content="Dog website" />
          <meta
            property="og:image"
            content="https://nextjs-mesh-seven.vercel.app/dog.png"
          />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="919" />
          <meta property="og:image:height" content="1280" />
          <meta property="og:type" content="website" />
        </head>
      </Head>
      <main className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-8 p-48">
        <div className="triangleTag" />
        <h1 className="customFont text-6xl font-bold mb-12 uppercase">Mesh</h1>{" "}
        {/* Larger and bolder font size, increased spacing */}
        <div className="flex flex-col items-center justify-center mb-12">
          {" "}
          {/* Increased bottom margin */}
          <Image src={qrCodeImage} alt="QR Code" width={600} className="mb-4" />
        </div>
        <p className="text-xl font-light">PLEASE SCAN ON YOUR MOBILE</p>
      </main>
    </>
  );
}
