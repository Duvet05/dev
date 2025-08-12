import type { Metadata } from "next";
import { VT323, Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

// Fuente local personalizada
const bauhausPixel = localFont({
  src: "./fonts/bauhaus-93-pixel.otf",
  variable: "--font-bauhaus-pixel",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cuadot | 3D Artist",
  description: "3D Artist & Developer Portfolio for Cuadot",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} ${bebasNeue.variable} ${bauhausPixel.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
