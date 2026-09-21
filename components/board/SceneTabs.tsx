import { cn } from "@/lib/utils";
import { SCENES } from "@/lib/vocabulary";
import type { Lang, SceneId } from "@/lib/vocabulary";
import type { SceneTab } from "./BoardProvider";

interface SceneTabsProps {
  tabs: SceneTab[];
  scene: SceneId;
  onChange: (scene: SceneId) => void;
  lang: Lang;
}

const BUILTIN_META = new Map(SCENES.map((s) => [s.id, s]));

/**
 * Scenes are told apart by this single small color-coded tab strip — never by
 * re-theming the whole app, so button layout stays physically consistent no
 * matter which scene is active.
 */
export function SceneTabs({ tabs, scene, onChange, lang }: SceneTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Scenes"
      className="grid gap-1.5 rounded-2xl border-2 border-line bg-card p-1.5"
      style={{ gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => {
        const meta = BUILTIN_META.get(tab.id as never);
        const active = tab.id === scene;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2 py-2 text-sm font-bold whitespace-nowrap focus-visible:outline-none sm:min-h-12 sm:text-base",
              active && meta
                ? cn(meta.activeBgClass, meta.activeTextClass)
                : active
                  ? "bg-primary text-primary-foreground"
                  : cn(meta ? meta.colorClass : "text-ink-soft", "hover:bg-marigold-soft/50"),
            )}
          >
            <span aria-hidden className="text-lg leading-none">
              {tab.emoji}
            </span>
            <span className="truncate">{lang === "hi" ? tab.hi : tab.en}</span>
          </button>
        );
      })}
    </div>
  );
}

interface LangToggleProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

/** One real regional-language pack, done properly — a first-class toggle. */
export function LangToggle({ lang, onChange }: LangToggleProps) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex shrink-0 overflow-hidden rounded-xl border-2 border-line bg-card"
    >
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => onChange(l)}
          className={cn(
            "px-4 py-2.5 text-base font-bold focus-visible:outline-none",
            lang === l
              ? "bg-marigold text-ink-on-marigold"
              : "text-ink-soft hover:bg-marigold-soft/50",
          )}
        >
          {l === "en" ? "English" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
