/**
 * Sahaayak progress engine — quiet encouragement, computed locally.
 *
 * Word mastery counts spoken use (the child said it aloud in a confirmed
 * sentence), never auto-generated. Badges reward honest milestones: streaks,
 * repairs made (self-advocacy!), scenes mastered.
 */

import { loadEvents, loadRepairs, loadSentences } from "./eventLog";
import { ALL_WORDS, findWord } from "./vocabulary";
import type { SceneId } from "./vocabulary";

export interface DayActivity {
  /** yyyy-mm-dd in local time */
  day: string;
  taps: number;
  speaks: number;
  repairs: number;
}

function dayKey(at: number): string {
  const d = new Date(at);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function last14Days(): DayActivity[] {
  const events = loadEvents();
  const repairs = loadRepairs();
  const byDay = new Map<string, DayActivity>();
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dayKey(d.getTime());
    byDay.set(key, { day: key, taps: 0, speaks: 0, repairs: 0 });
  }
  for (const e of events) {
    const a = byDay.get(dayKey(e.at));
    if (!a) continue;
    if (e.kind === "tap") a.taps += 1;
    if (e.kind === "speak") a.speaks += 1;
  }
  for (const r of repairs) {
    const a = byDay.get(dayKey(r.at));
    if (!a) continue;
    a.repairs += 1;
  }
  return [...byDay.values()];
}

/** Distinct words the child has spoken in confirmed sentences. */
export function spokenWordIds(): string[] {
  const words = new Set<string>();
  for (const s of loadSentences()) {
    for (const id of s.text.split(" ")) {
      if (findWord(id)) words.add(id);
  }
  }
  return [...words];
}

export interface Milestone {
  id: string;
  en: string;
  hi: string;
  target: number;
  current: number;
}

export function milestones(): Milestone[] {
  const spoken = spokenWordIds().length;
  const repairs = loadRepairs().length;
  const sentences = loadSentences().length;
  const scenes = new Set(loadEvents().filter((e) => e.kind === "scene").map((e) => e.scene));
  return [
    {
      id: "words",
      en: "words spoken",
      hi: "बोले गए शब्द",
      target: 25,
      current: spoken,
    },
    {
      id: "repairs",
      en: "“not that” repairs made",
      hi: "“वो नहीं” सुधार",
      target: 10,
      current: repairs,
    },
    {
      id: "sentences",
      en: "sentences built",
      hi: "बनाए गए वाक्य",
      target: 20,
      current: sentences,
    },
    {
      id: "scenes",
      en: "scenes used",
      hi: "उपयोग किए गए दृश्य",
      target: 4,
      current: Math.min(4, scenes.size),
    },
  ];
}

export interface Badge {
  id: string;
  en: string;
  hi: string;
  emoji: string;
  earned: boolean;
  detail: string;
}

export function badges(): Badge[] {
  const spoken = spokenWordIds();
  const repairCount = loadRepairs().length;
  const sentences = loadSentences().length;
  const streak = currentStreak();
  const scenes = new Set(loadEvents().filter((e) => e.kind === "scene").map((e) => e.scene));

  return [
    { id: "first-words", en: "First Words", hi: "पहले शब्द", emoji: "🌟", earned: spoken.length >= 1, detail: `${spoken.length}/1 words spoken` },
    { id: "ten-words", en: "Ten Words", hi: "दस शब्द", emoji: "⭐", earned: spoken.length >= 10, detail: `${spoken.length}/10 words spoken` },
    { id: "twenty-five", en: "25 Words!", hi: "25 शब्द!", emoji: "🏆", earned: spoken.length >= 25, detail: `${spoken.length}/25 words spoken` },
    { id: "first-sentence", en: "First Sentence", hi: "पहला वाक्य", emoji: "💬", earned: sentences >= 1, detail: `${sentences}/1 sentences` },
    { id: "sentence-10", en: "10 Sentences", hi: "10 वाक्य", emoji: "🗣️", earned: sentences >= 10, detail: `${sentences}/10 sentences` },
    { id: "first-repair", en: "Brave Repair", hi: "बहादुर सुधार", emoji: "↩️", earned: repairCount >= 1, detail: `${repairCount}/1 repairs` },
    { id: "repair-5", en: "Repair Star", hi: "सुधार सितारा", emoji: "🛠️", earned: repairCount >= 5, detail: `${repairCount}/5 repairs` },
    { id: "streak-3", en: "3-Day Streak", hi: "3-दिन की लय", emoji: "🔥", earned: streak >= 3, detail: `${streak}/3 day streak` },
    { id: "streak-7", en: "Week Streak", hi: "सप्ताह लय", emoji: "📅", earned: streak >= 7, detail: `${streak}/7 day streak` },
    { id: "explorer", en: "Scene Explorer", hi: "दृश्य खोजी", emoji: "🧭", earned: scenes.size >= 3, detail: `${scenes.size}/3 scenes used` },
  ];
}

export function currentStreak(): number {
  const days = last14Days();
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.taps > 0 || d.speaks > 0) {
      streak += 1;
    } else if (i === days.length - 1) {
      continue; // today with no activity yet doesn't break the streak
    } else {
      break;
    }
  }
  return streak;
}

/** The one "Try this" suggestion — a core word not yet used in a sentence. */
export function trySuggestion(): string | null {
  const spoken = new Set(spokenWordIds());
  const candidates = ALL_WORDS.filter((w) => w.cv >= 8 && !spoken.has(w.id));
  if (candidates.length === 0) return null;
  return candidates[0].id;
}

/** Vocabulary gaps: core words never spoken, per scene. */
export function vocabularyGaps(): { scene: string; missing: string[] }[] {
  const spoken = new Set(spokenWordIds());
  const scenes: string[] = ["home", "school", "clinic", "grandma", "overwhelmed"];
  return scenes.map((scene) => ({
    scene,
    missing: ALL_WORDS.filter((w) => w.cv >= 9 && w.scenes.includes(scene as SceneId) && !spoken.has(w.id)).map(
      (w) => w.en,
    ),
  }));
}
