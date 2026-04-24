import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAPO 10 - Camisetas de Time Premium",
  description: "Camisetas premium com identidade. Estilo de quem joga diferente.",
  icons: {
    icon: [
      { url: '/logo.jpeg' },
      { url: '/logo.jpeg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/logo.jpeg', sizes: '16x16', type: 'image/jpeg' },
    ],
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
