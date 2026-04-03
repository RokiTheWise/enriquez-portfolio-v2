"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileTextIcon, Mail } from "lucide-react";
import DecryptedText from "./DecryptedText";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Custom Brand Icons ──

const GithubIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A3.37 3.37 0 0 0 21 4.75A3.22 3.37 0 0 0 20.45 2s-1.66-.5-5.47 2.02a11.72 11.72 0 0 0-5.96 0C5.21 1.5 3.55 2 3.55 2A3.22 3.37 0 0 0 3 4.75a3.37 3.37 0 0 0-.94 2.61c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22" />
  </svg>
);

const LinkedinIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const ExploreButton = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const TARGET_TEXT = isMobile ? "Resume" : "View Resume";
  const [text, setText] = useState(TARGET_TEXT);

  useEffect(() => {
    setText(TARGET_TEXT);
  }, [TARGET_TEXT]);

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];

          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setText(TARGET_TEXT);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="pointer-events-auto relative group overflow-hidden border border-black bg-black px-5 py-2.5 md:px-10 md:py-4 font-mono text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-white transition-colors"
    >
      <div className="relative z-10 flex items-center gap-2">
        <FileTextIcon size={isMobile ? 12 : 16} className="text-[#FFB800]" />
        <span>{text}</span>
      </div>

      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-[#FFB800]/0 from-40% via-[#FFB800]/40 to-[#FFB800]/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

const SocialLink = ({ icon: Icon, href }: { icon: any; href: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto flex items-center transition-all duration-300"
    >
      <div
        className={cn(
          "flex items-center gap-1 md:gap-1.5 transition-colors duration-300",
          isHovered ? "text-[#FFB800]" : "text-[#666666]",
        )}
      >
        <span className="font-mono text-[10px] md:text-base opacity-50">[</span>
        <Icon
          size={isHovered ? 24 : 20}
          className={cn(
            "transition-all duration-300",
            isHovered && "drop-shadow-[0_0_12px_rgba(255,184,0,0.6)] scale-110",
          )}
        />
        <span className="font-mono text-[10px] md:text-base opacity-50">]</span>
      </div>
    </motion.a>
  );
};

// ── Tactile Terminal Navigation Row ──

const HUDButton = ({
  label,
  href = "#",
  className,
  isLast = false,
  decryptedProps = {},
}: {
  label: string;
  href?: string;
  className?: string;
  isLast?: boolean;
  decryptedProps?: any;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col">
      <motion.a
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className={cn(
          "pointer-events-auto relative group flex items-center font-mono tracking-widest text-black uppercase transition-all duration-300 py-1 md:py-2",
          className,
        )}
      >
        {/* Amber status square — appears on hover/tap */}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="mr-2 md:mr-3 w-1.5 h-1.5 bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.6)] flex-shrink-0"
        />

        {/* Bracket open */}
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
          className="mr-1 md:mr-2 text-[#FFB800] font-bold"
        >
          [
        </motion.span>

        {/* Shift right 6px on hover */}
        <motion.span
          className="relative"
          animate={{ x: isHovered ? 6 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <DecryptedText
            text={label}
            animateOn="hover"
            revealDirection="center"
            className="group-hover:text-[#FFB800] transition-colors duration-300"
            encryptedClassName="text-[#FFB800]/50"
            {...decryptedProps}
          />

          {isHovered && (
            <motion.span
              className="absolute inset-0 text-[#FFB800] opacity-50 blur-[1px] select-none pointer-events-none"
              animate={{
                x: [0, -2, 2, -1, 0],
                y: [0, 1, -1, 0, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.15,
                ease: "linear",
              }}
            >
              {label}
            </motion.span>
          )}
        </motion.span>

        {/* Bracket close */}
        <motion.span
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 5 }}
          className="ml-1 md:ml-2 text-[#FFB800] font-bold"
        >
          ]
        </motion.span>
      </motion.a>

      {/* Divider line below each nav item (except last) */}
      {!isLast && (
        <div className="h-[1px] bg-[#FFB800]/8 w-full" />
      )}
    </div>
  );
};

export default function HeroHUD() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none px-5 py-4 md:p-12 flex flex-col select-none overflow-hidden">
      {/* Scanline / Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* ═══ TOP ZONE: Identity + CTA ═══ */}
      <div className="flex justify-between items-start gap-3">
        {/* Identity Block */}
        <div className="flex items-center gap-2 md:gap-3 max-w-[60%] md:max-w-[40%]">
          <Image
            src="/DexDev-Logo.svg"
            alt="DexDev Logo"
            width={40}
            height={40}
            className="w-7 h-7 md:w-12 md:h-12 flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,184,0,0.4)]"
          />
          <div className="flex flex-col">
            <h1 className="font-mono text-base md:text-3xl font-bold tracking-tighter text-black uppercase leading-none">
              <DecryptedText
                text="DEXTER JETHRO ENRIQUEZ"
                animateOn="view"
                sequential
                speed={40}
              />
            </h1>
            <div className="font-mono text-[9px] md:text-xs tracking-[0.25em] md:tracking-[0.4em] text-[#FFB800] font-bold mt-0.5">
              <DecryptedText
                text="FULL STACK DEVELOPER"
                animateOn="view"
                sequential
                speed={60}
              />
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-end gap-2 md:gap-6 flex-shrink-0">
          <ExploreButton />

          {/* Time/System — desktop only */}
          <div className="hidden md:flex flex-col items-end gap-0.5 opacity-40 font-mono text-[10px] tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <DecryptedText text="Time:" animateOn="view" speed={100} />
              <span className="tabular-nums">{time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DecryptedText text="System:" animateOn="view" speed={100} />
              <span className="text-[#FFB800] font-bold">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ NAVIGATION: Directly below header on mobile, centered on desktop ═══ */}
      <div className="mt-2 md:mt-0 md:flex-grow md:flex md:items-center md:px-6">
        <div className="flex flex-col relative pl-3 md:pl-0 w-fit max-w-[70%] md:max-w-[40%]">
          <HUDButton label="Featured Projects" className="text-base md:text-xl leading-tight" />
          <HUDButton label="Techstack" className="text-base md:text-xl leading-tight" />
          <HUDButton label="About" className="text-base md:text-xl leading-tight" />
          <HUDButton label="Beyond Coding" className="text-base md:text-xl leading-tight" />
          <HUDButton label="Contact" className="text-base md:text-xl leading-tight" isLast />

          {/* Vertical accent line */}
          <div className="absolute -left-0.5 md:-left-6 top-0 bottom-0 w-[1px] bg-[#FFB800]/20" />
        </div>
      </div>

      {/* ═══ SPACER: pushes footer to the bottom on mobile ═══ */}
      <div className="flex-grow md:hidden" />

      {/* ═══ BOTTOM ZONE: Footer ═══ */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end pt-3 border-t border-[#FFB800]/10">
        {/* Availability & Location — always left-aligned */}
        <div className="font-mono text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] text-[#666666]">
          <div className="flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 border-l-2 border-[#FFB800] bg-white/10">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.5)]" />
              <span className="text-[#666666] font-bold uppercase">
                Availability:
              </span>
              <span className="uppercase font-medium text-[#FFB800]">
                Open for roles
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 border border-[#666666]/30" />
              <span className="text-[#666666] font-bold uppercase">Loc:</span>
              <span className="uppercase font-medium text-[#FFB800]">
                Manila, Ph
              </span>
            </div>
          </div>
        </div>

        {/* Socials — below availability on mobile (mt-4), right-aligned on desktop */}
        <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
          <div className="flex gap-1.5 md:gap-4 items-center">
            <SocialLink
              icon={GithubIcon}
              href="https://github.com/RokiTheWise"
            />
            <span className="text-[#666666]/20 text-[8px] md:text-[10px]">|</span>
            <SocialLink
              icon={LinkedinIcon}
              href="https://www.linkedin.com/in/dexter-jethro-enriquez/"
            />
            <span className="text-[#666666]/20 text-[8px] md:text-[10px]">|</span>
            <SocialLink
              icon={InstagramIcon}
              href="https://www.instagram.com/dexjet_enriquez/"
            />
            <span className="text-[#666666]/20 text-[8px] md:text-[10px]">|</span>
            <SocialLink
              icon={FacebookIcon}
              href="https://www.facebook.com/dexterjethro.enriquez"
            />
            <span className="text-[#666666]/20 text-[8px] md:text-[10px]">|</span>
            <SocialLink
              icon={Mail}
              href="mailto:dexterjethro.enriquez@gmail.com"
            />
          </div>

          <div className="hidden md:flex items-end gap-1 h-4 opacity-20 mt-2">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.2].map((h, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#FFB800]"
                animate={{
                  height: [`${h * 100}%`, `${(1 - h) * 100}%`, `${h * 100}%`],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1 + i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Border Corner Accents */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 w-6 h-6 md:w-12 md:h-12 border-t border-l md:border-t-2 md:border-l-2 border-[#FFB800]/20" />
      <div className="absolute top-3 right-3 md:top-6 md:right-6 w-6 h-6 md:w-12 md:h-12 border-t border-r md:border-t-2 md:border-r-2 border-[#FFB800]/20" />
      <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 w-6 h-6 md:w-12 md:h-12 border-b border-l md:border-b-2 md:border-l-2 border-[#FFB800]/20" />
      <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 w-6 h-6 md:w-12 md:h-12 border-b border-r md:border-b-2 md:border-r-2 border-[#FFB800]/20" />
    </div>
  );
}
