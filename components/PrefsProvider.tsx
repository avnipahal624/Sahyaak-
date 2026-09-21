import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadPrefs, savePrefs, type Mode, type Prefs, type Role, type TextSize } from "@/lib/prefs";

interface PrefsContextValue {
  prefs: Prefs;
  setMode: (mode: Mode) => void;
  setRole: (role: Role) => void;
  setName: (name: string) => void;
  setLang: (lang: "en" | "hi") => void;
  setTextSize: (size: TextSize) => void;
  setMotion: (motion: boolean) => void;
  setSound: (sound: boolean) => void;
  setMascot: (mascot: boolean) => void;
  setContrast: (contrast: boolean) => void;
  setVoice: (voice: string) => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());

  // Reflect prefs onto <html> so any component (and the Board's forced
  // sensory scope) can rely on document-level state.
  useEffect(() => {
    savePrefs(prefs);
    const root = document.documentElement;
    root.classList.toggle("mode-sensory", prefs.mode === "sensory");
    root.dataset.text = prefs.textSize;
    root.dataset.motion = prefs.motion ? "on" : "off";
    root.dataset.mascot = prefs.mascot ? "on" : "off";
    root.dataset.contrast = prefs.contrast ? "true" : "false";
  }, [prefs]);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo<PrefsContextValue>(
    () => ({
      prefs,
      setMode: (mode) => update("mode", mode),
      setRole: (role) => update("role", role),
      setName: (name) => update("name", name),
      setLang: (lang) => update("lang", lang),
      setTextSize: (textSize) => update("textSize", textSize),
      setMotion: (motion) => update("motion", motion),
      setSound: (sound) => update("sound", sound),
      setMascot: (mascot) => update("mascot", mascot),
      setContrast: (contrast) => update("contrast", contrast),
      setVoice: (voice) => update("voice", voice),
    }),
    [prefs, update],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
