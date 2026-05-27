import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://djenriquez.dev"),
  title: {
    default: "Dexter Jethro Enriquez — Software Developer",
    template: "%s — Dexter Jethro Enriquez",
  },
  description:
    "Portfolio of Dexter Jethro Enriquez — software developer, projects, and writing.",
  applicationName: "DJ Enriquez",
  authors: [{ name: "Dexter Jethro Enriquez" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: "Dexter Jethro Enriquez — Software Developer",
    description:
      "Portfolio of Dexter Jethro Enriquez — software developer, projects, and writing.",
    siteName: "Dexter Jethro Enriquez",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dexter Jethro Enriquez — Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dexter Jethro Enriquez — Software Developer",
    description:
      "Portfolio of Dexter Jethro Enriquez — software developer, projects, and writing.",
    images: ["/og-image.png"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dexter Jethro Enriquez",
  alternateName: "DJ Enriquez",
  url: "https://djenriquez.dev",
  image: "https://djenriquez.dev/og-image.png",
  jobTitle: "Software Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ateneo de Manila University",
  },
  sameAs: [
    "https://github.com/RokiTheWise",
    "https://www.linkedin.com/in/dexter-jethro-enriquez/",
    "https://www.instagram.com/dexjet_enriquez/",
    "https://www.facebook.com/dexterjethro.enriquez",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
