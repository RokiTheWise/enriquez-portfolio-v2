/* 1px viewfinder corner brackets — same treatment as FeaturedProjects. */
export default function ViewportBrackets({
  color,
  arm = 20,
}: {
  color: string;
  arm?: number;
}) {
  return (
    <>
      <svg className="absolute top-0 left-0" width={arm} height={arm}>
        <path d={`M0 ${arm} L0 0 L${arm} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute top-0 right-0" width={arm} height={arm}>
        <path d={`M0 0 L${arm} 0 L${arm} ${arm}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 left-0" width={arm} height={arm}>
        <path d={`M0 0 L0 ${arm} L${arm} ${arm}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 right-0" width={arm} height={arm}>
        <path d={`M0 ${arm} L${arm} ${arm} L${arm} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
    </>
  );
}
