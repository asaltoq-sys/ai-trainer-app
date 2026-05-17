import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // IMPORTAMOS LA BARRA

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fit IA Coach",
  description: "Tu entrenador personal impulsado por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
        <Navbar /> {/* LA COLOCAMOS AQUÍ PARA QUE SALGA EN TODA LA APP */}
      </body>
    </html>
  );
}