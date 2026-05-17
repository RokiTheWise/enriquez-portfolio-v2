"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  scrollRoot,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
    spacerClassName?: string;
  }[];
  contentClassName?: string;
  scrollRoot?: React.RefObject<HTMLElement | null>;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setEntryRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      entryRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const root = scrollRoot?.current ?? null;

    entryRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveCard(index);
          }
        },
        {
          root,
          // Narrow band around the vertical center of the scroll container
          rootMargin: "-45% 0px -45% 0px",
        },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [content.length, scrollRoot]);

  return (
    <div className="relative flex flex-col lg:flex-row lg:justify-between gap-0 lg:gap-16 px-4 md:px-0">
      {/* Mobile: top-sticky visual panel */}
      <div
        className={cn(
          "sticky top-48 z-10 aspect-[3/2] w-full overflow-hidden self-start mb-6 lg:hidden",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>

      {/* Left: scrolling text entries */}
      <div className="relative flex items-start">
        <div className="max-w-lg">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              ref={setEntryRef(index)}
              className={cn(
                "my-16 first:mt-8 last:mb-8",
                item.spacerClassName,
              )}
            >
              {/* Index pip — hidden for blank buffer cards */}
              {(item.title || item.description) && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1.5 h-1.5 transition-colors duration-300"
                    style={{
                      background:
                        activeCard === index
                          ? "#FFB800"
                          : "rgba(0,0,0,0.08)",
                    }}
                  />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-black/25 uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              )}

              <motion.h3
                animate={{
                  opacity: activeCard === index ? 1 : 0.2,
                  x: activeCard === index ? 0 : -4,
                }}
                transition={{ duration: 0.3 }}
                className="font-mono text-lg md:text-2xl font-bold tracking-tighter text-black uppercase"
              >
                {item.title}
              </motion.h3>
              <motion.p
                animate={{
                  opacity: activeCard === index ? 1 : 0.15,
                }}
                transition={{ duration: 0.3 }}
                className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/50 mt-3 max-w-sm"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: right-sticky visual panel */}
      <div
        className={cn(
          "sticky top-52 hidden h-72 w-80 flex-shrink-0 overflow-hidden self-start lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </div>
  );
};
