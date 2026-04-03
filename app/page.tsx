"use client";

import ReactLenis from "lenis/react";
import Hero from "@/components/Hero";
import Techstack from "@/components/Techstack";

export default function Home() {
  return (
    <ReactLenis root>
      <Hero />
      <Techstack />
    </ReactLenis>
  );
}
