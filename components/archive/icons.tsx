import {
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siFramer,
  siReact,
  siGsap,
  siPython,
  siTinkercad,
  siXyflow,
  siLucide,
  siArduino,
  siCplusplus,
  siPandas,
  siNumpy,
} from "simple-icons";

export const TECH_ICONS: Record<string, { path: string; color: string }> = {
  "Next.js":        { path: siNextdotjs.path,   color: "#000000" },
  "TypeScript":     { path: siTypescript.path,   color: "#3178C6" },
  "Tailwind":       { path: siTailwindcss.path,  color: "#06B6D4" },
  "Framer Motion":  { path: siFramer.path,       color: "#0055FF" },
  "React":          { path: siReact.path,        color: "#61DAFB" },
  "GSAP":           { path: siGsap.path,         color: "#88CE02" },
  "Python":         { path: siPython.path,       color: "#3776AB" },
  "Tinkercad":      { path: siTinkercad.path,    color: "#F16022" },
  "React Flow":     { path: siXyflow.path,       color: "#FF0072" },
  "Lucide React":   { path: siLucide.path,       color: "#F56565" },
  "Arduino":        { path: siArduino.path,      color: "#00979D" },
  "C++":            { path: siCplusplus.path,    color: "#00599C" },
  "pandas":         { path: siPandas.path,        color: "#150458" },
  "NumPy":          { path: siNumpy.path,         color: "#013243" },
  "Java":           { path: "M4.645 7.472c2.1.53 4.779.8 8.008.8 3.299 0 5.918-.27 8.008-.8 2.23-.52 3.299-1.22 3.299-1.88 0-.47-.48-.93-1.35-1.28.2.13.35.35.35.59 0 .67-1.01 1.22-3.039 1.68-1.88.41-4.279.7-7.198.7-2.82 0-5.329-.29-7.138-.68-1.95-.48-2.97-1-2.97-1.68 0-.28.13-.52.52-.8-1.22.47-1.88.87-1.88 1.47.07.68 1.16 1.36 3.39 1.88zm4.689-2.16c2.27-.2 2.929-1.659 5.588-1.899 1.31-.1 2.14.16 2.23.62.08.43-.57.72-1.36.78-1.09.11-1.54-.28-1.63-.65-.81.09-.94.43-.9.67.09.46 1.07.92 2.75.76 1.9-.15 2.54-.9 2.38-1.65-.2-.98-1.66-1.8-4.28-1.55-3.359.3-3.339 1.86-5.628 2.05-.94.09-1.46-.13-1.55-.5-.06-.37.4-.55.94-.59.5-.05 1.11.04 1.4.2.21-.11.28-.22.26-.35-.1-.35-.79-.5-1.66-.44-1.7.15-1.7.91-1.64 1.25.17.87 1.48 1.45 3.1 1.3zm11.417 3.84c-2.1.49-4.779.809-8.008.809-3.3 0-5.989-.34-8.078-.8-1.88-.48-2.88-1.01-3.23-1.56.18 1.23.49 2.42.89 3.55-.48.3-.91.67-1.3 1.17a4.519 4.519 0 00-1.019 3.098 3.6 3.599 0 001.42 2.62c.87.68 1.81.88 2.879.68.41-.07.87-.28 1.29-.42-.88 0-1.62-.28-2.36-.87a3.55 3.549 0 01-1.49-2.42c-.2-.94 0-1.81.53-2.579.12-.15.25-.28.39-.4.3.73.62 1.45.98 2.12.81 1.23 1.62 2.299 2.43 3.459.35.68.58 1.35.74 2.019a3.899 3.899 0 002.229 1.5c1.15.4 2.35.58 3.579.51h.13a10.197 10.197 0 003.689-.52 4.179 4.179 0 002.16-1.49h.07c.13-.67.35-1.34.67-2.02.799-1.17 1.619-2.229 2.419-3.458A20.995 20.993 0 0024 7.612c-.43.6-1.44 1.13-3.25 1.54z", color: "#2F2625" },
};

export function TechIcon({ name, size = 12 }: { name: string; size?: number }) {
  const icon = TECH_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={icon.color}
      className="flex-shrink-0"
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}

export function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
