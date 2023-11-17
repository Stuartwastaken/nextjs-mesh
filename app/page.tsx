import Image from 'next/image';
import qrCodeImage from '../public/qr_code_barcode.png';

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-8">
      {/* Early Access Tag */}
      <div className="triangleTag"></div>
      
      <h1 className="customFont text-6xl font-bold mb-12 uppercase">Mesh</h1> {/* Larger and bolder font size, increased spacing */}

      {/* Center QR Code */}
      <div className="flex flex-col items-center justify-center mb-12"> {/* Increased bottom margin */}
        <Image
          src={qrCodeImage}
          alt="QR Code"
          width={600} 
          className="mb-4" 
        />
      </div>


      <p className="text-xl font-light"> 
        PLEASE SCAN ON YOUR MOBILE
      </p>
    </main>
  )
}
