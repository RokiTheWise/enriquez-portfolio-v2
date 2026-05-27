import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "An archive of past projects, experiments, and side work by Dexter Jethro Enriquez.",
  openGraph: {
    title: "Archive — Dexter Jethro Enriquez",
    description:
      "An archive of past projects, experiments, and side work by Dexter Jethro Enriquez.",
  },
  twitter: {
    title: "Archive — Dexter Jethro Enriquez",
    description:
      "An archive of past projects, experiments, and side work by Dexter Jethro Enriquez.",
  },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
