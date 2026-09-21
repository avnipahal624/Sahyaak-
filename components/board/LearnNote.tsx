import { X } from "lucide-react";
import { useBoard } from "./BoardProvider";
import { findWord, wordLabel } from "@/lib/vocabulary";

/**
 * The one visible moment of learning: after "↩ not that", the board quietly
 * says what it changed — in plain language, never as a black box.
 */
export function LearnNote() {
  const { learnNote, clearLearnNote, lang } = useBoard();
  if (!learnNote) return null;

  const word = findWord(learnNote.wordId);
  const label = word ? wordLabel(word, lang) : "";

  return (
    <div
      role="status"
      className="animate-note-in flex items-center gap-3 rounded-2xl border-2 border-marigold bg-marigold-soft px-4 py-3"
    >
      <UndoBadge />
      <p className="flex-1 text-base leading-snug font-bold text-ink">
        {lang === "hi" ? (
          <>
            सीख गए — <span className="text-marigold-deep">{label}</span> नीचे चला
            जाएगा, और जो आप सच में कहना चाहते हैं वो ऊपर आ जाएगा.
          </>
        ) : (
          <>
            Learned — <span className="text-marigold-deep">{label}</span> moves
            down the board, and the words you meant move up.
          </>
        )}
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={clearLearnNote}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-ink-soft hover:bg-surface focus-visible:outline-none"
      >
        <X className="size-5" aria-hidden />
      </button>
    </div>
  );
}

function UndoBadge() {
  return (
    <span
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-marigold-deep/40 bg-surface"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5 stroke-[2.5] text-marigold-deep"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>
    </span>
  );
}
