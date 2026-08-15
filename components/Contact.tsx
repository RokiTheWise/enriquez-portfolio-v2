"use client";

import ContactParticles from "./contact/ContactParticles";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/RokiTheWise",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dexter-jethro-enriquez/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dexjet_enriquez/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/dexterjethro.enriquez",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const ARM = 20;

function CornerBrackets() {
  return (
    <>
      <svg className="absolute top-0 left-0 pointer-events-none z-10" width={ARM} height={ARM}>
        <path d={`M0 ${ARM} L0 0 L${ARM} 0`} fill="none" stroke="#FFB800" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none z-10" width={ARM} height={ARM}>
        <path d={`M0 0 L${ARM} 0 L${ARM} ${ARM}`} fill="none" stroke="#FFB800" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none z-10" width={ARM} height={ARM}>
        <path d={`M0 0 L0 ${ARM} L${ARM} ${ARM}`} fill="none" stroke="#FFB800" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
      <svg className="absolute bottom-0 right-0 pointer-events-none z-10" width={ARM} height={ARM}>
        <path d={`M0 ${ARM} L${ARM} ${ARM} L${ARM} 0`} fill="none" stroke="#FFB800" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    </>
  );
}

export default function ContactContent({
  pointerEvents = "auto",
}: {
  pointerEvents?: "auto" | "none";
}) {
  return (
    <div className="relative w-full h-full bg-white overflow-hidden" style={{ pointerEvents }}>
      <ContactParticles />
      <CornerBrackets />
      <div className="relative z-10 w-full h-[100dvh] md:h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFB800]" />
          </span>
          <span className="font-mono text-[8px] tracking-[0.35em] text-[#FFB800] uppercase">
            Signal: Online
          </span>
        </div>

        <h2
          className="font-mono font-bold uppercase mb-6 flex flex-col items-center"
          style={{ lineHeight: 0.92, letterSpacing: "-0.03em" }}
        >
          <span className="text-[clamp(4.5rem,8vw,6rem)] text-black">Get In</span>
          <span className="text-[clamp(4.5rem,8vw,6rem)] text-[#FFB800]">Touch</span>
        </h2>

        <div className="w-10 h-px bg-[#FFB800]/60 mb-6" />

        <p className="font-mono text-xs md:text-sm text-black/65 leading-[2] max-w-lg mb-10 tracking-wide text-center">
          Have a project in mind, want to collaborate,
          or just want to say hello?
          My inbox is always open.
        </p>

        <div className="w-full max-w-lg flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center justify-center gap-3">
          <a
            href="mailto:dexterjethro.enriquez@gmail.com"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#FFB800] px-8 py-4 font-mono text-xs font-bold tracking-[0.18em] text-black uppercase transition-[background-color,color,transform] duration-200 hover:bg-black hover:text-[#FFB800] active:scale-[0.97] active:duration-[120ms]"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send a Message
          </a>
          <div className="hidden md:block w-px h-8 bg-black/10" />
          <div className="grid grid-cols-4 gap-3 md:flex md:items-center md:justify-center">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex items-center justify-center h-12 w-full md:w-12 border border-black/10 text-black/62 transition-[border-color,color,background-color,transform] duration-200 hover:border-[#FFB800] hover:text-[#FFB800] hover:bg-[#FFB800]/5 active:scale-[0.97] active:duration-[120ms]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <span className="absolute bottom-5 font-mono text-[8px] tracking-[0.2em] text-black/55 uppercase">
          &copy; {new Date().getFullYear()} Dexter Jethro Enriquez
        </span>
      </div>
    </div>
  );
}
