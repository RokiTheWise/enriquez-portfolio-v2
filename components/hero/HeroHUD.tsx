"use client";

import { motion, useSpring, useMotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HUDButton = ({
  label,
  href = "#",
  className,
}: {
  label: string;
  href?: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  
  // Magnetic Effect Logic
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
    
    // Magnetic pull strength
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
        "pointer-events-auto relative group flex items-center font-mono text-sm tracking-widest text-black uppercase transition-colors duration-300",
        className,
      )}
    >
      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
        className="mr-2 text-orange-500 font-bold"
      >
        [
      </motion.span>
      
      <span className="relative">
        <span className="group-hover:text-orange-600 transition-colors duration-300">{label}</span>
        
        {/* Subtle glitch offset version */}
        {isHovered && (
          <motion.span 
            className="absolute inset-0 text-orange-400 opacity-50 blur-[1px] select-none pointer-events-none"
            animate={{ 
              x: [0, -2, 2, -1, 0],
              y: [0, 1, -1, 0, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.15,
              ease: "linear"
            }}
          >
            {label}
          </motion.span>
        )}
      </span>

      <motion.span
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 5 }}
        className="ml-2 text-orange-500 font-bold"
      >
        ]
      </motion.span>

      {/* Underline line */}
      <motion.div
        className="absolute -bottom-1 left-0 h-[1px] bg-black group-hover:bg-orange-500"
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
    <div className="absolute inset-0 z-10 pointer-events-none p-8 md:p-12 flex flex-col justify-between select-none">
      {/* Background Grid Pattern (Very subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Top Section */}
      <div className="flex justify-between items-start">
        {/* Left: Navigation Stack */}
        <div className="flex flex-col gap-6 relative">
          <HUDButton label="Selected Works" />
          <HUDButton label="Technical Stack" />
          <HUDButton label="About" />
          
          {/* Decorative vertical line */}
          <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-black/5" />
        </div>

        {/* Right: Primary CTA */}
        <div className="flex flex-col items-end gap-6">
          <div className="flex flex-col items-end">
            <motion.button
              className="pointer-events-auto px-10 py-4 bg-black text-white font-mono text-sm tracking-[0.3em] uppercase border border-black hover:bg-transparent hover:text-black transition-all duration-500 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore Archive</span>
              <motion.div
                className="absolute inset-0 bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              />
            </motion.button>
            <div className="mt-2 h-[1px] w-full bg-black/10 origin-right transition-colors" />
          </div>
          
          <div className="flex flex-col items-end gap-1 opacity-40 font-mono text-[10px] tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span>Time:</span>
              <span className="tabular-nums">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>System:</span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        {/* Left: Status Block */}
        <div className="flex flex-col gap-3 font-mono text-[10px] tracking-[0.15em] text-black/60">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-black font-bold">AVAILABILITY:</span>
              <span>OPEN FOR ROLES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 border border-black/20" />
              <span className="text-black font-bold">LOC:</span>
              <span>MANILA, PH</span>
            </div>
          </div>
          
          <div className="text-[9px] opacity-30 mt-2">
            © 2026 DEXTER JETHRO ENRIQUEZ / PORTFOLIO V2.0
          </div>
        </div>

        {/* Right: Socials Stack */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-6">
            <HUDButton label="Github" className="text-[11px] tracking-widest" />
            <HUDButton label="LinkedIn" className="text-[11px] tracking-widest" />
            <HUDButton label="Instagram" className="text-[11px] tracking-widest" />
          </div>
          
          {/* Decorative telemetry graphic */}
          <div className="flex items-end gap-1 h-4">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.2].map((h, i) => (
              <motion.div 
                key={i}
                className="w-1 bg-black/10"
                animate={{ height: [`${h * 100}%`, `${(1-h) * 100}%`, `${h * 100}%`] }}
                transition={{ repeat: Infinity, duration: 1 + i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Border Corner Accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-black/5" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-black/5" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-black/5" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-black/5" />
    </div>
  );
}
