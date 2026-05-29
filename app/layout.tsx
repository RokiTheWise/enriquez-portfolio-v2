import type { Metadata, Viewport } from "next";
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
  authors: [{ name: "Dexter Jethro Enriquez", url: "https://djenriquez.dev" }],
  creator: "Dexter Jethro Enriquez",
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
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
    locale: "en_US",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FFB800",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dexter Jethro Enriquez",
  alternateName: "DJ Enriquez",
  url: "https://djenriquez.dev",
  image: "https://djenriquez.dev/og-image.png",
  jobTitle: "Software Developer",
  description:
    "Software Developer and Computer Science student at Ateneo de Manila University specializing in full-stack web development.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ateneo de Manila University",
  },
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "GSAP",
    "Web Development",
    "Software Engineering",
  ],
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
