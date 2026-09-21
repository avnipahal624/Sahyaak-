import { cn } from "@/lib/utils";

type MascotMood = "hello" | "cheer" | "think";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  /** Learn + onboarding allow gentle motion; everywhere else stays static. */
  animated?: boolean;
  className?: string;
}

/**
 * Momo — Sahaayak's one mascot: a simple, thick-outline round bird.
 * Echoes road-sign simplicity rather than cartoon saturation. Lives in
 * onboarding, Home (static corner), Learn (may animate), and empty states.
 * NEVER appears on the AAC Board.
 */
export function Mascot({ mood = "hello", size = 64, animated = false, className }: MascotProps) {
  const wiggle = animated && mood !== "think";

  return (
    <span
      role="img"
      aria-label="Momo the bird"
      className={cn("inline-block shrink-0", wiggle && "animate-bounce-soft", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 96 96" width="100%" height="100%" aria-hidden>
        {/* body */}
        <circle cx="48" cy="52" r="30" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
        {/* head */}
        <circle cx="48" cy="34" r="20" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" />
        {/* eyes */}
        {mood === "cheer" ? (
          <>
            <path d="M39 30c1.8-2.6 5.2-2.6 7 0" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50 30c1.8-2.6 5.2-2.6 7 0" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="41" cy="31" r="3" fill="var(--ink)" />
            <circle cx="55" cy="31" r="3" fill="var(--ink)" />
          </>
        )}
        {/* beak — a cheerful chevron */}
        <path d="M43 39h10l-5 6z" fill="var(--marigold)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
        {/* wing — waves in Learn/onboarding */}
        <path
          d="M24 55c-6-4-8-10-6-14 5 1 9 5 11 9"
          fill="var(--surface)"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
          className={wiggle && mood === "cheer" ? "animate-wave" : undefined}
        />
        {/* tail */}
        <path d="M72 58c6-2 9-6 9-10-5-1-10 2-13 6" fill="var(--surface)" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        {/* feet */}
        <path d="M42 82v6M54 82v6" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        {/* think bubble for "Try this" moments */}
        {mood === "think" && (
          <>
            <circle cx="80" cy="20" r="7" fill="var(--marigold)" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="90" cy="10" r="4" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
          </>
        )}
      </svg>
    </span>
  );
}
