/**
 * Sahaayak ranking — one readable formula, not a black box.
 *
 *   score = recency-weighted personal use
 *         + scene relevance
 *         + time-of-day fit
 *         + communication value
 *         + repair nudges ("not that" corrections reshape the board)
 *
 * Rule-based, offline, explainable: every point of every score carries a
 * plain-language reason that can be shown to a child or caregiver.
 */

import type { SceneId, Word } from "./vocabulary";

export type EventKind = "tap" | "sentence" | "repair" | "scene" | "speak";

export interface EventRecord {
  kind: EventKind;
  wordId?: string;
  scene: SceneId;
  /** ms epoch */
  at: number;
}

export interface RepairRecord {
  id: string;
  /** The word the child rejected (e.g. tapped "help" then ↩ not that). */
  rejectedId: string;
  scene: SceneId;
  at: number;
  /** Optional: the word chosen instead, when the child goes on to pick one. */
  chosenId?: string;
}

export interface ScorePart {
  points: number;
  why: string;
}

export interface ScoredWord {
  word: Word;
  total: number;
  parts: ScorePart[];
}

/** Half-life in ms for recency weighting — a word used today >> used last week. */
const HALF_LIFE_MS = 36 * 60 * 60 * 1000;

/** Dayparts used for time-of-day fit. */
export function daypart(date = new Date()): "morning" | "evening" | "night" {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "evening";
  return "night";
}

/**
 * Score a set of words for a scene, right now.
 *
 * @param words         candidate words (already scene-filtered by the caller)
 * @param scene         active scene
 * @param events        local event log (taps per word)
 * @param repairs       local repair log ("not that" events)
 * @param now           ms epoch
 * @param sceneWordIds  optional override: which words count as "this scene's
 *                      words" (used for caregiver-created custom scenes)
 */
export function rankWords(
  words: Word[],
  scene: SceneId,
  events: EventRecord[],
  repairs: RepairRecord[],
  now = Date.now(),
  sceneWordIds?: Set<string>,
): ScoredWord[] {
  const tapTime = new Map<string, number>();
  for (const e of events) {
    if (e.kind === "tap" && e.wordId) {
      const prev = tapTime.get(e.wordId) ?? 0;
      if (e.at > prev) tapTime.set(e.wordId, e.at);
    }
  }

  // repair nudges: rejected words get pushed DOWN, everything else in the
  // scene gets a small lift — exactly like a good human conversation partner
  // quietly re-shuffles after "not that".
  const recentRepairs = repairs.filter((r) => now - r.at < 3 * 24 * 60 * 60 * 1000);
  const rejectionCount = new Map<string, number>();
  for (const r of recentRepairs) {
    rejectionCount.set(r.rejectedId, (rejectionCount.get(r.rejectedId) ?? 0) + 1);
  }
  const totalRejections = recentRepairs.length;
  const dp = daypart(new Date(now));

  const scored = words.map((word) => {
    const parts: ScorePart[] = [];

    // 1. recency-weighted personal use (0 – 6)
    const last = tapTime.get(word.id);
    if (last !== undefined) {
      const age = Math.max(0, now - last);
      const recency = 6 * Math.pow(0.5, age / HALF_LIFE_MS);
      parts.push({
        points: round1(recency),
        why: "you used this recently",
      });
    }

    // 2. scene relevance (0 – 3): words authored for this room come first
    const inScene = sceneWordIds ? sceneWordIds.has(word.id) : word.scenes.includes(scene);
    if (inScene) {
      parts.push({
        points: scene === "overwhelmed" ? 2 : 3,
        why: scene === "overwhelmed" ? "helps right now" : "fits this place",
      });
    }

    // 3. time-of-day fit (0 – 2)
    const fit = word.timeFit?.[dp];
    if (fit !== undefined && fit > 0) {
      parts.push({
        points: round1(2 * fit),
        why: dp === "morning" ? "often wanted in the morning" : dp === "evening" ? "often wanted in the evening" : "often wanted at night",
      });
    }

    // 4. communication value (0 – 5): the term that matters most.
    //    Core words, feelings, refusals and repair phrases outrank
    //    preferred objects so the board never just optimizes for
    //    what is easiest to tap.
    parts.push({
      points: round1(0.5 * word.cv),
      why: word.cv >= 8 ? "important word — keep it close" : "useful word",
    });

    // 5. repair nudges (−4 … +1.5)
    const rejects = rejectionCount.get(word.id) ?? 0;
    if (rejects > 0) {
      parts.push({
        points: -Math.min(4, 1.5 * rejects),
        why: "moved down — you said “not that”",
      });
    } else if (totalRejections > 0) {
      parts.push({
        points: round1(Math.min(1.5, 0.25 * totalRejections)),
        why: "moved up after your correction",
      });
    }

    const total = round1(parts.reduce((sum, p) => sum + p.points, 0));
    return { word, total, parts };
  });

  // Deterministic order: score, then communication value, then id — so the
  // board is stable and predictable between taps (motor memory matters).
  scored.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.word.cv !== a.word.cv) return b.word.cv - a.word.cv;
    return a.word.id.localeCompare(b.word.id);
  });

  return scored;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Plain-language, one-line explanation of why a word sits where it sits. */
export function explain(scored: ScoredWord): string {
  const top = [...scored.parts].sort((a, b) => b.points - a.points)[0];
  if (!top) return "useful word";
  return top.why;
}
