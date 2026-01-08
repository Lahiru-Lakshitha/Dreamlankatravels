import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google"; // Premium fonts
import "@/index.css";
import Layout from "@/components/layout/Layout";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dream Lanka Travels | Luxury Sri Lanka Tours & Experiences",
  description:
    "Experience the finest of Sri Lanka with Dream Lanka Travels. Bespoke luxury tours, private villas, and exclusive experiences tailored for the discerning traveler.",
  keywords:
    "Luxury Sri Lanka tours, 5-star travel Sri Lanka, private tours, boutique hotels, Dream Lanka Travels, premium holidays",
  authors: [{ name: "Dream Lanka Travels" }],
  openGraph: {
    title: "Dream Lanka Travels | Luxury Sri Lanka Tours",
    description:
      "Experience the finest of Sri Lanka with Dream Lanka Travels. Bespoke luxury tours and exclusive experiences.",
    type: "website",
    url: "https://voyageslanka.com",
    images: [
      { url: "https://lovable.dev/opengraph-image-p98pqg.png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VoyagesLanka",
    title: "Dream Lanka Travels | Luxury Sri Lanka Tours",
    description:
      "Experience the finest of Sri Lanka with Dream Lanka Travels. Bespoke luxury tours and exclusive experiences.",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-gold/30 selection:text-foreground">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
