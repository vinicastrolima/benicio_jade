import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const fontScript = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://cha-revelacao-jade-ou-benicio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Chá Revelação: Jade ou Benício? • Confirmação de Presença",
  description: "10 de Outubro às 14h • Salão Me Diversões. Confirme sua presença e dê seu palpite no bolão da Jade ou Benício!",
  keywords: ["Chá Revelação", "Jade ou Benício", "Confirmação de Presença", "RSVP", "Bebê"],
  authors: [{ name: "Mamãe e Papai" }],
  openGraph: {
    siteName: "Chá Revelação: Jade ou Benício?",
    title: "Chá Revelação: Jade ou Benício? • 10 de Outubro às 14h",
    description: "Mamãe e Papai estão muito felizes e ansiosos! Confirme sua presença e participe do bolão.",
    images: [
      {
        url: "/convite.jpg",
        width: 1024,
        height: 1024,
        type: "image/jpeg",
        alt: "Convite Chá Revelação Jade ou Benício",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chá Revelação: Jade ou Benício? • 10 de Outubro às 14h",
    description: "Mamãe e Papai estão muito felizes e ansiosos! Confirme sua presença e participe do bolão.",
    images: ["/convite.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fontSerif.variable} ${fontScript.variable} ${fontSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
