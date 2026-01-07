import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/index.css";
import Layout from "@/components/layout/Layout";
import { Providers } from "./providers";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "Voyages Lanka | Premium Sri Lanka Tours & Travel Experiences",
    description: "Discover Sri Lanka with Voyages Lanka - Your trusted tour operator for cultural heritage, wildlife safaris, beach holidays, and adventure tours.",
    keywords: "Sri Lanka tours, Sri Lanka travel, Ceylon tours, Sigiriya, Kandy, Yala safari, Sri Lanka beach, Sri Lanka honeymoon, Sri Lanka wildlife",
    authors: [{ name: "Voyages Lanka" }],
    openGraph: {
        title: "Voyages Lanka | Premium Sri Lanka Tours",
        description: "Discover the Pearl of the Indian Ocean with our expertly crafted tours.",
        type: "website",
        url: "https://voyageslanka.com",
        images: [{ url: "https://lovable.dev/opengraph-image-p98pqg.png" }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@VoyagesLanka",
        title: "Voyages Lanka | Premium Sri Lanka Tours",
        description: "Discover the Pearl of the Indian Ocean with our expertly crafted tours.",
        images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Providers>
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
