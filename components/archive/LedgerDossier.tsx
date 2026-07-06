"use client";

import type { ArchiveEntry } from "./data";
import ViewportBrackets from "./ViewportBrackets";
import { TechIcon, GithubIcon } from "./icons";

/*
 * Expanded ledger row — the "dossier".
 * Rendered inside an AnimatePresence height animation by LedgerRow.
 * Desktop: screenshot (45%) | details (55%). Mobile: stacked.
 */
export default function LedgerDossier({ entry }: { entry: ArchiveEntry }) {
  return (
    <div className="grid md:grid-cols-[45%_1fr] gap-6 md:gap-10 pt-2 pb-8 md:pb-10 pl-10 md:pl-14 pr-2 md:pr-8">
      {/* Screenshot in viewfinder frame */}
      {entry.image && (
        <div className="relative w-full aspect-[16/10]">
          <ViewportBrackets color={entry.accentColor} />
          <div className="absolute inset-[7px] overflow-hidden bg-[#F5F5F5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image}
              alt={entry.project}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: entry.imagePosition ?? "center" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: entry.accentColor }}
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className={`flex flex-col gap-4 md:gap-5 ${entry.image ? "" : "md:col-span-2"}`}>
        {/* Classification line */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5" style={{ background: entry.accentColor }} />
          <span className="font-mono text-[9px] tracking-[0.3em] text-black/50 uppercase">
            {entry.month ? `${entry.month} ${entry.year} · ` : `${entry.year} · `}
            {entry.classification}
          </span>
        </div>

        {/* Description */}
        <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/60">
          {entry.description}
        </p>

        {/* Tech registry */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[8px] tracking-[0.3em] text-black/40 uppercase">
            Tech Stack
          </span>
          <div className="flex flex-wrap">
            {entry.tech.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-2.5 px-3.5 py-2 border border-black/[0.06] -ml-[1px] -mt-[1px] cursor-default"
              >
                <TechIcon name={t.name} />
                <span className="font-mono text-[11px] md:text-xs font-bold tracking-wider text-black/80 uppercase">
                  {t.name}
                </span>
                <span className="font-mono text-[8px] tracking-[0.2em] text-black/35 uppercase">
                  {t.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Collaborators */}
        {entry.collaborators && (
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[8px] tracking-[0.3em] text-black/40 uppercase">
              Built With
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {entry.collaborators.map((c) => (
                <a
                  key={c.github}
                  href={c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-black/50 hover:text-black transition-colors duration-150 underline underline-offset-2"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTAs — main-page button grammar */}
        {(entry.link || entry.github) && (
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {entry.link && (
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black bg-black text-white px-5 py-2.5 no-underline transition-colors duration-200 hover:bg-transparent hover:text-black"
              >
                <span>View Deployment</span>
                <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
              </a>
            )}
            {entry.github && (
              <a
                href={entry.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black text-black px-5 py-2.5 no-underline transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <GithubIcon />
                <span>Source Code</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
