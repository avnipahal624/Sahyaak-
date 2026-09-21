/**
 * Sahaayak local event log — offline-first, on-device by default.
 *
 * Taps, spoken sentences, scene switches and "not that" repairs are recorded
 * locally in localStorage. Nothing leaves the device unless a signed-in
 * caregiver explicitly syncs to the Insights mirror (opt-in, Convex).
 */

import type { EventRecord, RepairRecord } from "./ranking";
import type { SceneId } from "./vocabulary";

const EVENTS_KEY = "sahaayak:v1:events";
const REPAIRS_KEY = "sahaayak:v1:repairs";
const SENTENCES_KEY = "sahaayak:v1:sentences";
const MAX_EVENTS = 600;
const MAX_REPAIRS = 150;
const MAX_SENTENCES = 200;

export interface SentenceRecord {
  text: string;
  lang: "en" | "hi";
  scene: SceneId;
  at: number;
}

function read<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private mode — the board still works, log is best-effort
  }
}

export function loadEvents(): EventRecord[] {
  return read<EventRecord>(EVENTS_KEY);
}

export function loadRepairs(): RepairRecord[] {
  return read<RepairRecord>(REPAIRS_KEY);
}

export function logEvent(record: EventRecord) {
  const events = loadEvents();
  events.push(record);
  write(EVENTS_KEY, events.slice(-MAX_EVENTS));
}

export function logRepair(record: RepairRecord) {
  const repairs = loadRepairs();
  repairs.push(record);
  write(REPAIRS_KEY, repairs.slice(-MAX_REPAIRS));
}

export function loadSentences(): SentenceRecord[] {
  return read<SentenceRecord>(SENTENCES_KEY);
}

export function logSentence(record: SentenceRecord) {
  const sentences = loadSentences();
  sentences.push(record);
  write(SENTENCES_KEY, sentences.slice(-MAX_SENTENCES));
}

/** Attach the word the child settled on after a "not that" repair. */
export function linkChosenToLastRepair(chosenId: string) {
  const repairs = loadRepairs();
  for (let i = repairs.length - 1; i >= 0; i -= 1) {
    if (!repairs[i].chosenId) {
      repairs[i] = { ...repairs[i], chosenId };
      write(REPAIRS_KEY, repairs);
      return;
    }
  }
}

export function clearLog() {
  try {
    window.localStorage.removeItem(EVENTS_KEY);
    window.localStorage.removeItem(REPAIRS_KEY);
    window.localStorage.removeItem(SENTENCES_KEY);
  } catch {
    // ignore
  }
}
