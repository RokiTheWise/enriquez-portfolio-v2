"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Archive, Mail } from "lucide-react";
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

  const TARGET_TEXT = isMobile ? "Archive" : "Explore Archive";
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
      className="pointer-events-auto relative group overflow-hidden border border-black bg-black px-4 py-2 md:px-10 md:py-4 font-mono text-[9px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-white transition-colors"
    >
      <div className="relative z-10 flex items-center gap-2">
        <Archive size={isMobile ? 12 : 16} className="text-[#ffc300]" />
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
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-[#ffc300]/0 from-40% via-[#ffc300]/40 to-[#ffc300]/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

const SocialLink = ({
  icon: Icon,
  href,
}: {
  icon: any;
  href: string;
}) => {
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
          "flex items-center gap-1.5 transition-colors duration-300",
          isHovered ? "text-[#ffc300]" : "text-black/30",
        )}
      >
        <span className="font-mono text-xs md:text-base opacity-50">[</span>
        <Icon
          size={isHovered ? 24 : 20}
          className={cn(
            "transition-all duration-300",
            isHovered &&
              "text-white drop-shadow-[0_0_12px_rgba(255,195,0,0.6)] scale-110",
          )}
        />
        <span className="font-mono text-xs md:text-base opacity-50">]</span>
      </div>
    </motion.a>
  );
};

const Sparkline = () => {
  return (
    <svg
      width="60"
      height="15"
      className="opacity-50 inline-block align-baseline ml-2"
    >
      <motion.path
        d="M0 10 L5 15 L10 5 L15 12 L20 8 L25 18 L30 10 L35 14 L40 4 L45 12 L50 8 L55 15 L60 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

const HUDButton = ({
  label,
  href = "#",
  className,
  decryptedProps = {},
}: {
  label: string;
  href?: string;
  className?: string;
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
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn(
        "pointer-events-auto relative group flex items-center font-mono tracking-widest text-black uppercase transition-colors duration-300",
        className,
      )}
    >
      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
        className="mr-1 md:mr-2 text-[#ffc300] font-bold"
      >
        [
      </motion.span>

      <span className="relative">
        <DecryptedText
          text={label}
          animateOn="hover"
          revealDirection="center"
          className="group-hover:text-[#ffc300] transition-colors duration-300"
          encryptedClassName="text-[#ffc300]/50"
          {...decryptedProps}
        />

        {isHovered && (
          <motion.span
            className="absolute inset-0 text-[#ffc300] opacity-50 blur-[1px] select-none pointer-events-none"
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
      </span>

      <motion.span
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 5 }}
        className="ml-1 md:ml-2 text-[#ffc300] font-bold"
      >
        ]
      </motion.span>

      <motion.div
        className="absolute -bottom-1 left-0 h-[1px] bg-black group-hover:bg-[#ffc300]"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
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
    <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-12 flex flex-col justify-between select-none overflow-hidden">
      {/* Scanline / Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Top Section: Identity & CTA */}
      <div className="flex justify-between items-start gap-4">
        {/* Identity Block */}
        <div className="flex flex-col gap-2 max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <div className="flex items-center gap-3">
            <Image
              src="/DexDev-Logo.svg"
              alt="DexDev Logo"
              width={40}
              height={40}
              className="md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(255,195,0,0.4)]"
            />
            <div className="flex flex-col">
              <h1 className="font-mono text-lg sm:text-xl md:text-3xl font-bold tracking-tighter text-black uppercase leading-tight">
                <DecryptedText
                  text="DEXTER JETHRO C. ENRIQUEZ"
                  animateOn="view"
                  sequential
                  speed={40}
                />
              </h1>
              <div className="font-mono text-[8px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] text-[#ffc300] font-bold opacity-80">
                <DecryptedText
                  text="FULL STACK DEVELOPER"
                  animateOn="view"
                  sequential
                  speed={60}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-end gap-3 md:gap-6 max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <ExploreButton />

          <div className="flex flex-col items-end gap-0.5 opacity-40 font-mono text-[7px] md:text-[10px] tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <DecryptedText text="Time:" animateOn="view" speed={100} />
              <span className="tabular-nums">{time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DecryptedText text="System:" animateOn="view" speed={100} />
              <span className="text-[#ffc300] font-bold">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Main Navigation & Stats */}
      <div className="flex flex-grow items-center justify-between mt-4 mb-4 px-2 md:px-6">
        {/* Navigation Stack */}
        <div className="flex flex-col gap-4 md:gap-8 relative pl-3 md:pl-0 max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <HUDButton label="Featured Projects" className="text-xs md:text-xl" />
          <HUDButton label="Techstack" className="text-xs md:text-xl" />
          <HUDButton label="About" className="text-xs md:text-xl" />
          <HUDButton label="Beyond Coding" className="text-xs md:text-xl" />
          <HUDButton label="Contact" className="text-xs md:text-xl" />

          <div className="absolute -left-2 md:-left-6 top-0 bottom-0 w-[1px] bg-[#ffc300]/20" />
        </div>

        {/* System Stats Block - Hidden on small mobile */}
        <div className="hidden sm:flex flex-col items-end gap-4 pointer-events-auto max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <div className="flex flex-col items-end gap-2 p-4 md:p-6 border border-[#ffc300]/10 bg-white/5 backdrop-blur-[2px] font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-black">
            <div className="text-[#ffc300] font-bold mb-1 md:mb-2 opacity-70 tracking-widest text-[10px] md:text-[11px]">
              <DecryptedText
                text="SYSTEM_STATS // 04-2026"
                animateOn="view"
                sequential
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-black/40">PROJECT_COUNT:</span>
              <span className="font-bold text-[#ffc300]">[12]</span>
              <Sparkline />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-black/40">CORE_TECH:</span>
              <span className="font-bold text-[#ffc300]">[08]</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-black/40">UPTIME:</span>
              <span className="font-bold">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Horizon Line */}
      <div className="flex justify-between items-end gap-4 pt-3 border-t border-[#ffc300]/10">
        {/* Left: Status Block */}
        <div className="flex flex-col gap-2 font-mono text-[7px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] text-black/60 max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <div className="flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 border-l-2 border-[#ffc300] bg-white/10">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-black font-bold uppercase">
                Availability:
              </span>
              <span className="uppercase font-medium text-[#ffc300]">
                Open for roles
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1 md:w-1.5 h-1 md:h-1.5 border border-[#ffc300]/30" />
              <span className="text-black font-bold uppercase">Loc:</span>
              <span className="uppercase font-medium text-[#ffc300]">
                Manila, Ph
              </span>
            </div>
          </div>

          <div className="text-[6px] md:text-[9px] opacity-30 uppercase">
            © 2026 DEXTER JETHRO ENRIQUEZ
          </div>
        </div>

        {/* Right: Socials Stack */}
        <div className="flex flex-col items-end gap-3 md:gap-4 h-full max-w-[30%] md:max-w-[35%] lg:max-w-[40%]">
          <div className="flex gap-2 md:gap-4 justify-end items-center mb-1 md:mb-2">
            <SocialLink icon={GithubIcon} href="https://github.com" />
            <span className="text-[#ffc300]/20 text-[10px]">|</span>
            <SocialLink icon={LinkedinIcon} href="https://linkedin.com" />
            <span className="text-[#ffc300]/20 text-[10px]">|</span>
            <SocialLink icon={InstagramIcon} href="https://instagram.com" />
            <span className="text-[#ffc300]/20 text-[10px]">|</span>
            <SocialLink icon={FacebookIcon} href="https://facebook.com" />
            <span className="text-[#ffc300]/20 text-[10px]">|</span>
            <motion.a
              href="mailto:contact@dexter.dev"
              className="pointer-events-auto flex items-center transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 text-black/30 hover:text-[#ffc300] transition-colors">
                <span className="font-mono text-xs md:text-base opacity-50">[</span>
                <Mail size={20} className="hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,195,0,0.6)]" />
                <span className="font-mono text-xs md:text-base opacity-50">]</span>
              </div>
            </motion.a>
          </div>

          <div className="flex items-end gap-0.5 md:gap-1 h-2.5 md:h-4 opacity-20">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.2].map((h, i) => (
              <motion.div
                key={i}
                className="w-0.5 md:w-1 bg-[#ffc300]"
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
      <div className="absolute top-3 left-3 md:top-6 md:left-6 w-6 h-6 md:w-12 md:h-12 border-t border-l md:border-t-2 md:border-l-2 border-[#ffc300]/20" />
      <div className="absolute top-3 right-3 md:top-6 md:right-6 w-6 h-6 md:w-12 md:h-12 border-t border-r md:border-t-2 md:border-r-2 border-[#ffc300]/20" />
      <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 w-6 h-6 md:w-12 md:h-12 border-b border-l md:border-b-2 md:border-l-2 border-[#ffc300]/20" />
      <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 w-6 h-6 md:w-12 md:h-12 border-b border-r md:border-b-2 md:border-r-2 border-[#ffc300]/20" />
    </div>
  );
}
