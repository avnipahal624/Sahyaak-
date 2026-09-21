import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  categoryOf,
  wordLabel,
  type Lang,
  type Word,
  type WordCategory,
} from "@/lib/vocabulary";

/** Modified Fitzgerald Key tints — the ONLY color coding on the board. */
const CATEGORY_BG: Record<WordCategory, string> = {
  person: "bg-cat-person",
  action: "bg-cat-action",
  object: "bg-cat-object",
  social: "bg-cat-social",
};

const CATEGORY_BORDER: Record<WordCategory, string> = {
  person: "border-cat-person-border/45",
  action: "border-cat-action-border/45",
  object: "border-cat-object-border/45",
  social: "border-cat-social-border/45",
};

const CATEGORY_TEXT: Record<WordCategory, string> = {
  person: "text-cat-person-border",
  action: "text-cat-action-border",
  object: "text-cat-object-border",
  social: "text-cat-social-border",
};

export function categoryBg(word: Word): string {
  return CATEGORY_BG[categoryOf(word)];
}

export function categoryBorder(word: Word): string {
  return CATEGORY_BORDER[categoryOf(word)];
}

export function categoryText(word: Word): string {
  return CATEGORY_TEXT[categoryOf(word)];
}

interface WordTileProps {
  word: Word;
  lang: Lang;
  onTap: (wordId: string) => void;
  /** Visually quieter variant for the always-available core rows. */
  quiet?: boolean;
}

/**
 * One tile = one icon + one word, always both. Deep rounded-xl corners, a
 * strict 6px gap handled by the parent grid, and a large tap target.
 *
 * Labels scale with the TILE (container query), not the viewport, so text
 * grows and shrinks to use the space available without ever wrapping or
 * clipping — the hard requirement for a fixed, non-scrolling grid.
 */
export function WordTile({ word, lang, onTap, quiet = false }: WordTileProps) {
  const Icon = word.icon;
  const cat = categoryOf(word);

  return (
    <button
      type="button"
      aria-label={wordLabel(word, lang)}
      className={cn(
        "@container flex h-full min-h-14 w-full flex-col items-center justify-center gap-[3%] rounded-xl border-[3px] px-1 py-[6%] text-center select-none focus-visible:outline-none",
        cn(CATEGORY_BG[cat], CATEGORY_BORDER[cat]),
        "active:border-ink/60",
      )}
      onClick={() => onTap(word.id)}
    >
      <Icon
        className={cn(
          "shrink-0 stroke-[2.25]",
          "h-[34%] w-[34%] min-h-6 min-w-6",
          CATEGORY_TEXT[cat],
        )}
        aria-hidden
      />
      <span
        className={cn(
          "max-w-full text-center leading-[1.05] font-medium whitespace-nowrap text-ink",
          quiet
            ? "text-[clamp(0.68rem,7.5cqw,1.05rem)]"
            : "text-[clamp(0.75rem,8.5cqw,1.2rem)]",
        )}
      >
        {wordLabel(word, lang)}
      </span>
    </button>
  );
}

interface StripChipProps {
  word: Word;
  lang: Lang;
  onRemove: () => void;
  highlighted?: boolean;
}

/** A word sitting in the sentence strip — tap to remove it. */
export function StripChip({ word, lang, onRemove, highlighted = false }: StripChipProps) {
  const Icon = word.icon;
  return (
    <button
      type="button"
      aria-label={`${wordLabel(word, lang)} — remove`}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-xl border-3 px-3 py-2 sm:px-4 sm:py-2.5",
        "focus-visible:outline-none",
        cn(CATEGORY_BG[categoryOf(word)], CATEGORY_BORDER[categoryOf(word)]),
        highlighted && "animate-word-in ring-2 ring-marigold ring-inset",
      )}
      onClick={onRemove}
    >
      <Icon
        className={cn(
          "size-6 shrink-0 stroke-[2.25] sm:size-7",
          CATEGORY_TEXT[categoryOf(word)],
        )}
        aria-hidden
      />
      <span className="text-sm leading-none font-medium whitespace-nowrap text-ink sm:text-base">
        {wordLabel(word, lang)}
      </span>
      <X className="size-4 shrink-0 text-ink-soft/60" aria-hidden />
    </button>
  );
}
