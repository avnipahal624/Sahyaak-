/**
 * Sahaayak user preferences — persisted locally, applied app-wide.
 *
 * Includes the Mode A / Mode B design-system switch: Mode A (sunny) for
 * Home, Explore, Learn and Progress; Mode B (sensory-reduced) globally, and
 * ALWAYS for the Board, regardless of the global mode.
 */

export type Mode = "sunny" | "sensory";
export type Role = "child" | "parent" | "teacher" | "therapist";
export type TextSize = "normal" | "large" | "xlarge";

export interface Prefs {
  /** Global design mode. The Board always renders sensory-reduced. */
  mode: Mode;
  role: Role;
  /** Child's first name for the greeting — stored on-device only. */
  name: string;
  lang: "en" | "hi";
  textSize: TextSize;
  /** Master motion switch (Learn + onboarding mascot animations). */
  motion: boolean;
  /** Sound effects / voice lines outside the Board. */
  sound: boolean;
  /** Show the mascot outside the Board. */
  mascot: boolean;
  /** High-contrast text option. */
  contrast: boolean;
  /** TTS voice hint, e.g. "hi-IN-Standard-A" or "en-IN-Neerja". */
  voice: string;
}

const KEY = "sahaayak:v1:prefs";

const DEFAULTS: Prefs = {
  mode: "sunny",
  role: "child",
  name: "",
  lang: "en",
  textSize: "normal",
  motion: true,
  sound: true,
  mascot: true,
  contrast: false,
  voice: "",
};

export function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrefs(prefs: Prefs) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // ignore — prefs are best-effort
  }
}
