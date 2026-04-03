import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAP — Mind Assistant Protocol",
  description: "Segundo cérebro inteligente para ideias e tarefas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${outfit.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-foreground bg-[#0f0f0f] selection:bg-[#7c3aed]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
