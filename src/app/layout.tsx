import type { Metadata } from "next";
import {
  UnifrakturMaguntia,
  Pirata_One,
  Newsreader,
  Playfair_Display,
  Anton,
  Space_Grotesk,
  Galada,
  Tiro_Bangla,
  Atma,
} from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SocialWidget } from "@/components/SocialWidget";

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gothic",
  display: "swap",
});

const pirata = Pirata_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pirata",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-serif",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const galada = Galada({
  weight: "400",
  subsets: ["bengali", "latin"],
  variable: "--font-bengali-display",
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali", "latin"],
  style: ["normal", "italic"],
  variable: "--font-bengali-serif",
  display: "swap",
});

const atma = Atma({
  weight: ["500", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bengali-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The RCC Talkies ",
    template: "%s | The RCC Talkies",
  },
  description:
    "The Voice of RCCIIT. Kolkata-based independent student journalism, media society, and campus archive.",
  keywords: [
    "RCC Talkies",
    "RCCIIT",
    "The Paper Portfolio",
    "journalism club",
    "Kolkata",
    "campus news",
    "college magazine",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html
      lang="en"
      className={`${unifraktur.variable} ${pirata.variable} ${newsreader.variable} ${playfair.variable} ${anton.variable} ${spaceGrotesk.variable} ${galada.variable} ${tiroBangla.variable} ${atma.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-[#e5e0d3] text-[#14120e] selection:bg-[#14120e] selection:text-[#e5e0d3]">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <SocialWidget />
      </body>
    </html>
  );
}
