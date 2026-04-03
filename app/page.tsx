"use client";

import ReactLenis from "lenis/react";
import HeroTransition from "@/components/HeroTransition";
import Techstack from "@/components/Techstack";

export default function Home() {
  return (
    <ReactLenis root>
      <HeroTransition />
      <Techstack />
    </ReactLenis>
  );
}
