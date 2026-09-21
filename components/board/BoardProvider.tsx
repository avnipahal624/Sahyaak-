import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  linkChosenToLastRepair,
  loadEvents,
  loadRepairs,
  logEvent,
  logRepair,
  logSentence,
  type SentenceRecord,
} from "@/lib/eventLog";
import {
  daypart,
  rankWords,
  type EventRecord,
  type RepairRecord,
  type ScoredWord,
} from "@/lib/ranking";
import {
  ALL_WORDS,
  findWord,
  SCENES as SCENES_META,
  wordsForScene,
  type Lang,
  type SceneId,
} from "@/lib/vocabulary";
import { getCustomScene, listCustomScenes, loadEnabledScenes } from "@/lib/customScenes";
import { speak } from "@/lib/tts";
import { usePrefs } from "@/components/PrefsProvider";

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

export interface SceneTab {
  id: SceneId;
  en: string;
  hi: string;
  emoji: string;
  custom?: boolean;
}

interface BoardContextValue {
  scene: SceneId;
  sceneTabs: SceneTab[];
  setScene: (scene: SceneId) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  query: string;
  setQuery: (q: string) => void;
  searchResults: string[] | null;
  strip: string[];
  ranked: ScoredWord[];
  learnNote: { wordId: string; at: number } | null;
  clearLearnNote: () => void;
  tapWord: (wordId: string) => void;
  removeAt: (index: number) => void;
  clearStrip: () => void;
  speakStrip: () => void;
  markRepair: (rejectedId: string) => void;
  repTime: number;
  lastSpoken: string | null;
}

const BoardContext = createContext<BoardContextValue | null>(null);

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw && (allowed as readonly string[]).includes(raw)) return raw as T;
  } catch {
    // ignore
  }
  return null;
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

const SCENE_KEY = "sahaayak:v1:scene";
const LANG_KEY = "sahaayak:v1:lang";

export function BoardProvider({ children }: { children: ReactNode }) {
  const { prefs } = usePrefs();

  const [scene, setSceneState] = useState<SceneId>(
    () =>
      readStored(SCENE_KEY, [
        "home",
        "school",
        "clinic",
        "grandma",
        "overwhelmed",
        ...listCustomScenes().map((s) => s.id),
      ] as const) ?? "home",
  );
  const [lang, setLangState] = useState<Lang>(
    () => readStored(LANG_KEY, ["en", "hi"] as const) ?? "en",
  );
  const [query, setQuery] = useState("");
  const [strip, setStrip] = useState<string[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [repairs, setRepairs] = useState<RepairRecord[]>([]);
  const [learnNote, setLearnNote] = useState<{ wordId: string; at: number } | null>(null);
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);
  const [repTime, setRepTime] = useState(() => Date.now());

  // Keep the Board's language in step with the app language chosen in
  // onboarding / Settings.
  useEffect(() => {
    setLangState(prefs.lang);
  }, [prefs.lang]);

  // Hydrate the local log once on mount.
  useEffect(() => {
    setEvents(loadEvents());
    setRepairs(loadRepairs());
  }, []);

  // Refresh time-of-day fit without any animation — a quiet, slow clock.
  useEffect(() => {
    const id = window.setInterval(() => setRepTime(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Scene tabs: enabled built-ins first, then caregiver-created scenes.
  const sceneTabs = useMemo<SceneTab[]>(() => {
    const enabled = new Set(loadEnabledScenes());
    const builtIn = SCENES_META.filter((s) => enabled.has(s.id));
    const custom = listCustomScenes().map((s) => ({
      id: s.id,
      en: s.en,
      hi: s.hi,
      emoji: s.emoji,
      custom: true,
    }));
    return [...builtIn, ...custom];
  }, []);

  const ranked = useMemo(() => {
    const custom = getCustomScene(scene);
    if (custom) {
      const words = custom.wordIds
        .map((id) => findWord(id))
        .filter((w): w is NonNullable<typeof w> => w !== undefined);
      return rankWords(words, scene, events, repairs, repTime, new Set(custom.wordIds));
    }
    return rankWords(wordsForScene(scene), scene, events, repairs, repTime);
  }, [scene, events, repairs, repTime]);

  // Full-vocabulary search — the whole library is always reachable.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_WORDS.filter(
      (w) => w.en.toLowerCase().includes(q) || w.hi.includes(query.trim()),
    ).map((w) => w.id);
  }, [query]);

  const setScene = useCallback((next: SceneId) => {
    setSceneState(next);
    writeStored(SCENE_KEY, next);
    const record: EventRecord = { kind: "scene", scene: next, at: Date.now() };
    logEvent(record);
    setEvents((prev) => [...prev, record]);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeStored(LANG_KEY, next);
  }, []);

  const tapWord = useCallback(
    (wordId: string) => {
      const at = Date.now();
      // The first pick after a "not that" repair is what the child actually
      // meant — attach it to the repair so the nudge gets smarter.
      if (learnNote) linkChosenToLastRepair(wordId);
      const record: EventRecord = { kind: "tap", wordId, scene, at };
      logEvent(record);
      setEvents((prev) => [...prev, record]);
      setStrip((prev) => [...prev, wordId]);
      setLearnNote(null);
    },
    [scene, learnNote],
  );

  const removeAt = useCallback((index: number) => {
    setStrip((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearStrip = useCallback(() => setStrip([]), []);

  const speakStrip = useCallback(() => {
    const text = strip.join(" ");
    if (!text.trim()) return;
    speak(text, lang, prefs.voice);
    setLastSpoken(text);
    const record: EventRecord = { kind: "speak", scene, at: Date.now() };
    logEvent(record);
    setEvents((prev) => [...prev, record]);
    const sentence: SentenceRecord = { text, lang, scene, at: Date.now() };
    logSentence(sentence);
  }, [strip, lang, scene, prefs.voice]);

  const markRepair = useCallback(
    (rejectedId: string) => {
      const repair: RepairRecord = {
        id: makeId(),
        rejectedId,
        scene,
        at: Date.now(),
      };
      logRepair(repair);
      setRepairs((prev) => [...prev, repair]);
      // backing out of the choice: the rejected word leaves the strip
      setStrip((prev) => prev.filter((id) => id !== rejectedId));
      setLearnNote({ wordId: rejectedId, at: Date.now() });
    },
    [scene],
  );

  const clearLearnNote = useCallback(() => setLearnNote(null), []);

  const value: BoardContextValue = {
    scene,
    sceneTabs,
    setScene,
    lang,
    setLang,
    query,
    setQuery,
    searchResults,
    strip,
    ranked,
    learnNote,
    clearLearnNote,
    tapWord,
    removeAt,
    clearStrip,
    speakStrip,
    markRepair,
    repTime,
    lastSpoken,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used inside <BoardProvider>");
  return ctx;
}
