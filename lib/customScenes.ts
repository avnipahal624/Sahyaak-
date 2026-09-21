/**
 * Caregiver-created custom scenes — stored on-device, additive only.
 *
 * A custom scene brings its own words to the front; it can never remove the
 * always-available row (refusals, repair, pain stay reachable at all times).
 */

import type { SceneId } from "./vocabulary";

export interface CustomScene {
  id: string;
  en: string;
  hi: string;
  emoji: string;
  wordIds: string[];
  createdAt: number;
}

const KEY = "sahaayak:v1:customScenes";
const MAX_SCENES = 6;
const MAX_WORDS = 18;

function loadAll(): CustomScene[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomScene[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(scenes: CustomScene[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(scenes));
  } catch {
    // best-effort
  }
}

export function listCustomScenes(): CustomScene[] {
  return loadAll();
}

export function getCustomScene(id: string): CustomScene | undefined {
  return loadAll().find((s) => s.id === id);
}

export function saveCustomScene(input: Omit<CustomScene, "createdAt">): CustomScene {
  const scenes = loadAll();
  const existing = scenes.findIndex((s) => s.id === input.id);
  const scene: CustomScene = { ...input, createdAt: existing >= 0 ? scenes[existing].createdAt : Date.now() };
  if (existing >= 0) {
    scenes[existing] = scene;
  } else {
    if (scenes.length >= MAX_SCENES) {
      throw new Error(`Up to ${MAX_SCENES} custom scenes supported`);
    }
    scenes.push(scene);
  }
  saveAll(scenes);
  return scene;
}

export function deleteCustomScene(id: string) {
  saveAll(loadAll().filter((s) => s.id !== id));
}

/** Words for a scene: built-ins from vocabulary + custom scene words. */
export function wordsForAnyScene(scene: SceneId): string[] {
  const custom = getCustomScene(scene);
  if (custom) return custom.wordIds.slice(0, MAX_WORDS);
  return [];
}

export const CUSTOM_SCENE_LIMITS = { MAX_SCENES, MAX_WORDS };

/* ——— Enabled built-in scenes (onboarding picks the starting set) ——— */

const ENABLED_KEY = "sahaayak:v1:enabledScenes";
const ALL_BUILT_IN = ["home", "school", "clinic", "grandma", "overwhelmed"];

export function loadEnabledScenes(): string[] {
  try {
    const raw = window.localStorage.getItem(ENABLED_KEY);
    if (!raw) return ALL_BUILT_IN;
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed) || parsed.length === 0) return ALL_BUILT_IN;
    return parsed.filter((s) => ALL_BUILT_IN.includes(s));
  } catch {
    return ALL_BUILT_IN;
  }
}

export function saveEnabledScenes(scenes: string[]) {
  try {
    window.localStorage.setItem(ENABLED_KEY, JSON.stringify(scenes));
  } catch {
    // best-effort
  }
}
