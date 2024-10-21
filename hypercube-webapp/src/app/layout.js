import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Hypercube",
  description: "Hypercube provides security and ensures you have an exceptional experience, leveraging sensors, AI, and loyalty points to offer safety and exclusive benefits throughout your stay.",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
