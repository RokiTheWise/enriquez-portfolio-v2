"use client";

import ReactLenis from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroTransition from "@/components/HeroTransition";
import About from "@/components/About";
import Techstack from "@/components/Techstack";
import FeaturedProjects from "@/components/FeaturedProjects";
import StaggeredMenu from "@/components/StaggeredMenu";

const MENU_ITEMS = [
  { label: "Home", ariaLabel: "Go to top", link: "#" },
  { label: "About", ariaLabel: "About section", link: "#about" },
  { label: "Tech Stack", ariaLabel: "Tech stack section", link: "#techstack" },
  { label: "Projects", ariaLabel: "Featured projects", link: "#projects" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
];

const SOCIAL_ITEMS = [
  { label: "GitHub", link: "https://github.com/RokiTheWise" },
  { label: "LinkedIn", link: "https://www.linkedin.com/in/dexter-jethro-enriquez/" },
  { label: "Instagram", link: "https://www.instagram.com/dexjet_enriquez/" },
  { label: "Facebook", link: "https://www.facebook.com/dexterjethro.enriquez" },
  { label: "Email", link: "mailto:dexterjethro.enriquez@gmail.com" },
];

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-[#FFB800] origin-left z-[60]"
      style={{ scaleX, opacity }}
    />
  );
}

function NavMenu() {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [100, 300], [0, 1]);
  const navPointerEvents = useTransform(navOpacity, (v) =>
    v > 0.01 ? ("auto" as const) : ("none" as const),
  );

  return (
    <motion.div style={{ opacity: navOpacity, pointerEvents: navPointerEvents }}>
      <StaggeredMenu
        position="right"
        items={MENU_ITEMS}
        socialItems={SOCIAL_ITEMS}
        displaySocials
        displayItemNumbering
        logoUrl="/DexDev-Logo.svg"
        logoText="Dexter Jethro Enriquez"
        resumeUrl="/Enriquez_DexterJethro_Resume.pdf"
        menuButtonColor="#000"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={false}
        colors={["#FFF3D6", "#FFB800"]}
        accentColor="#FFB800"
        isFixed
      />
    </motion.div>
  );
}

export default function Home() {
  return (
    <ReactLenis root>
      <ScrollProgressBar />
      <NavMenu />
      <HeroTransition />
      <About />
      <Techstack />
      <FeaturedProjects />
    </ReactLenis>
  );
}
