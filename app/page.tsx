import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-8">
      {/* Early Access Tag */}
      <div className="triangleTag"></div>
      
      {/* Mesh Text in Custom Font */}
      <h1 className="customFont text-4xl">Mesh</h1>

      {/* Center QR Code Placeholder - Add your QR Code here */}
      <div className="flex flex-col items-center justify-center">
        <p className="mt-4 text-center">
          PLEASE SCAN ON YOUR MOBILE
        </p>
      </div>
    </main>
  )
}
