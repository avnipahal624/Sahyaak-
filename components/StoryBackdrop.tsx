import { cn } from "@/lib/utils";

/**
 * StoryBackdrop — the hand-drawn layer of the storybook world.
 *
 * Scattered pastel stars live on the page itself (see index.css); this layer
 * adds the little illustrations — a bunny, flowers, clouds, a moon — pinned
 * to the page edges, always behind the content, never interactive, and never
 * rendered inside the Board's calm scope.
 */

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 44" fill="none" aria-hidden className={className}>
      <path
        d="M22 36c-8 0-14-5-14-12 0-6 5-11 11-11 1-7 7-11 13-11 5 0 9 2 12 6 2-2 5-3 8-3 7 0 13 6 13 13 6 0 10 4 10 9 0 5-5 9-11 9H22Z"
        fill="#ffffff"
        stroke="#e3b75f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Flower({ className, petal = "#f3aec4" }: { className?: string; petal?: string }) {
  return (
    <svg viewBox="0 0 48 72" fill="none" aria-hidden className={className}>
      <path d="M24 34v34" stroke="#8fae6f" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 52c-6-2-10-6-11-12 6 1 10 5 11 12Zm0 0c6-2 10-6 11-12-6 1-10 5-11 12Z" fill="#a8cd8a" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="12"
          rx="7"
          ry="11"
          fill={petal}
          stroke="#d99b5b"
          strokeWidth="2"
          transform={`rotate(${deg} 24 23)`}
        />
      ))}
      <circle cx="24" cy="23" r="6.5" fill="#f7d574" stroke="#d99b5b" strokeWidth="2" />
    </svg>
  );
}

function Bunny({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 84" fill="none" aria-hidden className={className}>
      <ellipse cx="30" cy="22" rx="6" ry="17" fill="#fdeedd" stroke="#d9a06b" strokeWidth="2.5" transform="rotate(-8 30 22)" />
      <ellipse cx="44" cy="21" rx="6" ry="17" fill="#fdeedd" stroke="#d9a06b" strokeWidth="2.5" transform="rotate(8 44 21)" />
      <circle cx="37" cy="46" r="18" fill="#fdeedd" stroke="#d9a06b" strokeWidth="2.5" />
      <circle cx="30" cy="43" r="2.2" fill="#5b4426" />
      <circle cx="44" cy="43" r="2.2" fill="#5b4426" />
      <path d="M35 51c1 1.6 3 1.6 4 0" stroke="#5b4426" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35.5" cy="48.5" r="1.6" fill="#f0a3b8" />
      <path d="M37 58c4 8 10 12 10 20" stroke="#fdeedd" strokeWidth="7" strokeLinecap="round" opacity="0" />
      <ellipse cx="59" cy="72" rx="9" ry="5" fill="#ffffff" stroke="#e3b75f" strokeWidth="0" opacity="0" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" aria-hidden className={className}>
      <path
        d="M44 38a21 21 0 0 1-26-26 21 21 0 1 0 26 26Z"
        fill="#f7d574"
        stroke="#d9a55b"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden className={className}>
      <circle cx="30" cy="30" r="13" fill="#f7d574" stroke="#d9a55b" strokeWidth="2.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="30"
          y1="6"
          x2="30"
          y2="12"
          stroke="#d9a55b"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${deg} 30 30)`}
        />
      ))}
    </svg>
  );
}

function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 44" fill="none" aria-hidden className={className}>
      <ellipse cx="17" cy="17" rx="12" ry="10" fill="#cfc3ec" stroke="#a08bd0" strokeWidth="2" transform="rotate(-18 17 17)" />
      <ellipse cx="39" cy="17" rx="12" ry="10" fill="#f3aec4" stroke="#d98aa8" strokeWidth="2" transform="rotate(18 39 17)" />
      <ellipse cx="20" cy="32" rx="8" ry="7" fill="#cfc3ec" stroke="#a08bd0" strokeWidth="2" transform="rotate(14 20 32)" />
      <ellipse cx="36" cy="32" rx="8" ry="7" fill="#f3aec4" stroke="#d98aa8" strokeWidth="2" transform="rotate(-14 36 32)" />
      <line x1="28" y1="12" x2="28" y2="36" stroke="#8a7350" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 12c-2-3-4-4-6-4m6 4c2-3 4-4 6-4" stroke="#8a7350" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** One little four-point sparkle, drawn like a crayon star. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2c1 5.5 4.5 9 10 10-5.5 1-9 4.5-10 10-1-5.5-4.5-9-10-10 5.5-1 9-4.5 10-10Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DECOR = [
  { C: Sun, className: "left-[1.5%] top-[3%] w-14 lg:w-20", color: undefined },
  { C: Cloud, className: "left-[16%] top-[1.5%] w-20 lg:w-28", color: undefined },
  { C: Bunny, className: "left-[1%] top-[46%] w-14 lg:w-20", color: undefined },
  { C: Flower, className: "left-[4%] bottom-[6%] w-9 lg:w-12", color: "#cfc3ec" },
  { C: Moon, className: "right-[2%] top-[4%] w-12 lg:w-16", color: undefined },
  { C: Cloud, className: "right-[15%] top-[10%] w-16 lg:w-24", color: undefined },
  { C: Butterfly, className: "right-[1.5%] top-[42%] w-12 lg:w-16", color: undefined },
  { C: Flower, className: "right-[4%] bottom-[8%] w-9 lg:w-12", color: "#f3aec4" },
  { C: Cloud, className: "left-[28%] bottom-[2%] w-16 lg:w-20", color: undefined },
] as const;

export function StoryBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none opacity-70"
    >
      {DECOR.map(({ C, className, color }, i) => (
        <C key={i} className={cn("absolute", className)} {...(color ? { petal: color } : {})} />
      ))}
    </div>
  );
}
