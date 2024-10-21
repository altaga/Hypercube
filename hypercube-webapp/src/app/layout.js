import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="my-header">
          <div className="header-logo">
            <Link href="">
              <Image
                src={"/assets/logo.png"}
                alt="Hypercube Logo"
                priority
                layout="fill"
                objectFit="cover"
              />
            </Link>
          </div>
          <div className="header-name">
            <Image
              src={"/assets/name.png"}
              alt="Hypercube Logo"
              priority
              layout="fill" // Makes the image fill the wrapper while keeping aspect ratio
              objectFit="cover" // Ensures the image covers the whole area
            />
          </div>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
