/**
 * Sahaayak vocabulary — hand-authored, bilingual (English + Hindi), per-scene.
 *
 * Rules baked into the data:
 *  - Every tile = one icon + one word, never icon-only, never word-only.
 *  - Refusals ("no"), pain, and repair phrases exist in EVERY scene and are
 *    always pinned to the always-available row: a scene changes what's on top,
 *    never what's allowed to exist.
 *  - "Communication value" ranks core words, feelings, refusals, and repair
 *    phrases above preferred objects, so the board never just optimizes for
 *    what is easiest to tap.
 */

import {
  Ambulance,
  Apple,
  Backpack,
  Banana,
  Bandage,
  Ban,
  Bath,
  BatteryLow,
  BedDouble,
  Bell,
  Blocks,
  BookOpen,
  Brain,
  Bus,
  Cake,
  Car,
  Carrot,
  CircleCheck,
  CirclePause,
  CircleX,
  Clock,
  CloudRain,
  Cookie,
  Cross,
  Croissant,
  CupSoda,
  Dog,
  DoorOpen,
  Donut,
  Drum,
  Ellipsis,
  Ear,
  Egg,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  GlassWater,
  GraduationCap,
  Grape,
  Hand,
  HandHelping,
  Handshake,
  Headphones,
  Heart,
  HeartCrack,
  HeartPulse,
  Home,
  Hospital,
  House,
  Hourglass,
  IceCreamCone,
  LightbulbOff,
  Rabbit,
  Salad,
  Milk,
  Moon,
  Music,
  Paintbrush,
  Palette,
  PenLine,
  Pencil,
  Pill,
  Pizza,
  Puzzle,
  Refrigerator,
  RotateCcw,
  ScanLine,
  School,
  ShieldCheck,
  Smile,
  Snail,
  Snowflake,
  Sofa,
  Soup,
  Speaker,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  Thermometer,
  Toilet,
  Trees,
  Trophy,
  Tv,
  Undo2,
  User,
  UserRound,
  Users,
  Utensils,
  VolumeX,
  Waves,
  Weight,
  Wheat,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type BuiltInSceneId =
  | "home"
  | "school"
  | "clinic"
  | "grandma"
  | "overwhelmed";
/** Scene ids include caregiver-created custom scenes (any string). */
export type SceneId = BuiltInSceneId | (string & {});
export type Lang = "en" | "hi";

/**
 * Modified Fitzgerald Key categories — every core tile carries one, and the
 * tile background is tinted by category (never by decoration):
 *   person  → pastel yellow (pronouns / people)
 *   action  → pastel green (verbs / actions)
 *   object  → pastel orange (nouns / objects)
 *   social  → pastel blue (social / core words)
 */
export type WordCategory = "person" | "action" | "object" | "social";

export interface Word {
  id: string;
  en: string;
  hi: string;
  icon: LucideIcon;
  /** Communication value: core words, feelings, refusals and repair outrank objects. */
  cv: number;
  /** Which scenes this word belongs to. */
  scenes: SceneId[];
  /** Time-of-day fit (0–1), used by the transparent ranking formula. */
  timeFit?: { morning?: number; evening?: number; night?: number };
  /** Fitzgerald category for color-coded core tiles. */
  category?: WordCategory;
}

export interface SceneMeta {
  id: BuiltInSceneId;
  en: string;
  hi: string;
  emoji: string;
  colorClass: string;
  activeBgClass: string;
  activeTextClass: string;
  ringClass: string;
}

export const SCENES: SceneMeta[] = [
  {
    id: "home",
    en: "Home",
    hi: "घर",
    emoji: "🏠",
    colorClass: "text-scene-home",
    activeBgClass: "bg-scene-home",
    activeTextClass: "text-white",
    ringClass: "ring-scene-home/35",
  },
  {
    id: "school",
    en: "School",
    hi: "स्कूल",
    emoji: "🏫",
    colorClass: "text-scene-school",
    activeBgClass: "bg-scene-school",
    activeTextClass: "text-white",
    ringClass: "ring-scene-school/35",
  },
  {
    id: "clinic",
    en: "Clinic",
    hi: "क्लिनिक",
    emoji: "🩺",
    colorClass: "text-scene-clinic",
    activeBgClass: "bg-scene-clinic",
    activeTextClass: "text-white",
    ringClass: "ring-scene-clinic/35",
  },
  {
    id: "grandma",
    en: "Grandma's House",
    hi: "नानी का घर",
    emoji: "🐇",
    colorClass: "text-scene-grandma",
    activeBgClass: "bg-scene-grandma",
    activeTextClass: "text-white",
    ringClass: "ring-scene-grandma/35",
  },
  {
    id: "overwhelmed",
    en: "Calm Corner",
    hi: "शांत कोना",
    emoji: "🌙",
    colorClass: "text-scene-overwhelmed",
    activeBgClass: "bg-scene-overwhelmed",
    activeTextClass: "text-white",
    ringClass: "ring-scene-overwhelmed/35",
  },
];

/**
 * Repair phrases, feelings and core words available in EVERY scene, always.
 * Ordered to fill the board's three bottom core rows exactly: 5 per row on
 * desktop (15 tiles + repair button = 16) and 4 per row on mobile (12 tiles
 * + repair button = 13, with 3 spilling into the scene rows above). The
 * relative order never shifts between the two breakpoints.
 */
export const ALWAYS_WORDS: Word[] = [
  { id: "not-that", en: "not that", hi: "वो नहीं", icon: Undo2, cv: 10, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "no", en: "no", hi: "नहीं", icon: CircleX, cv: 10, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "yes", en: "yes", hi: "हाँ", icon: Hand, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "help", en: "help", hi: "मदद", icon: HandHelping, cv: 10, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "stop", en: "stop", hi: "रुको", icon: CirclePause, cv: 10, scenes: ["home", "school", "clinic", "overwhelmed"], category: "action" },
  { id: "more", en: "more", hi: "और", icon: Ellipsis, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "wait", en: "wait", hi: "इंतज़ार", icon: Hourglass, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "action" },
  { id: "pain", en: "pain", hi: "दर्द", icon: Bandage, cv: 10, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "tired", en: "tired", hi: "थका हुआ", icon: BatteryLow, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "i", en: "I", hi: "मैं", icon: UserRound, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "person" },
  { id: "you", en: "you", hi: "आप", icon: Users, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "person" },
  { id: "mum2b", en: "mum", hi: "माँ", icon: Heart, cv: 7, scenes: ["home", "school", "clinic", "overwhelmed"], category: "person" },
  { id: "feelings", en: "feelings", hi: "भावनाएँ", icon: Heart, cv: 8, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "happy", en: "happy", hi: "खुश", icon: Smile, cv: 8, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "sad", en: "sad", hi: "उदास", icon: HeartCrack, cv: 8, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "hungry", en: "hungry", hi: "भूख", icon: Utensils, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "toilet", en: "toilet", hi: "टॉयलेट", icon: Toilet, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "object" },
  { id: "too-loud", en: "too loud", hi: "बहुत शोर", icon: VolumeX, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "social" },
  { id: "break", en: "break", hi: "ठहराव", icon: LightbulbOff, cv: 9, scenes: ["home", "school", "clinic", "overwhelmed"], category: "action" },
  { id: "bathroom", en: "bathroom", hi: "बाथरूम", icon: Bath, cv: 8, scenes: ["home", "school", "clinic", "overwhelmed"], category: "object" },
];

/**
 * The core row(s) pinned to the bottom of the board — the "persistent core
 * vocabulary" rendered in soft teal. ALWAYS_WORDS minus the repair control,
 * which is rendered as its own distinct first tile in the same rows.
 */
export const CORE_WORDS: Word[] = ALWAYS_WORDS.filter((w) => w.id !== "not-that");

export const REPAIR_WORD = ALWAYS_WORDS[0];

// ——— Scene-word categories (Modified Fitzgerald Key) ———
// Scene words are hand-tagged by id so every tile on the board carries a
// category color; anything not listed defaults to object (pastel orange).

const SCENE_PERSON = new Set([
  "grandma", "mum", "dad", "teacher", "friend", "doctor", "nurse", "mum2",
  "nani", "grandpa",
]);

const SCENE_ACTION = new Set([
  "go", "play", "drink", "eat", "walk", "write", "read", "draw", "paint",
  "open", "wash", "bath", "rest", "repeat", "again", "answer", "understand",
  "dont-understand", "understand2", "recess", "check", "slow-down", "come-back",
  "go-out", "deep-breath", "squeeze", "brush", "garden",
]);

const SCENE_SOCIAL = new Set([
  "love-you", "hug", "hug2", "quiet", "quiet2", "want", "scared", "scared2",
  "angry", "dizzy", "sick", "fever", "cough", "alone", "safe", "cant-talk",
  "not-now", "not-ready", "too-much", "all-done", "finished", "heavy",
  "cosy", "miss-you",
]);

/** Resolve a word's Fitzgerald category (core words carry it; scene words are tagged by id). */
export function categoryOf(word: Word): WordCategory {
  if (word.category) return word.category;
  if (SCENE_PERSON.has(word.id)) return "person";
  if (SCENE_ACTION.has(word.id)) return "action";
  if (SCENE_SOCIAL.has(word.id)) return "social";
  return "object";
}

function w(
  id: string,
  en: string,
  hi: string,
  icon: LucideIcon,
  cv: number,
  scenes: SceneId[],
  timeFit?: Word["timeFit"],
): Word {
  return { id, en, hi, icon, cv, scenes, timeFit };
}

export const SCENE_WORDS: Word[] = [
  // ——— Home ———
  w("grandma", "grandma", "दादी", Heart, 4, ["home"]),
  w("mum", "mum", "माँ", Heart, 4, ["home"]),
  w("dad", "dad", "पापा", Heart, 4, ["home"]),
  w("love-you", "love you", "आई लव यू", Heart, 6, ["home"]),
  w("go", "go", "चलो", Footprints, 8, ["home"]),
  w("play", "play", "खेलना", Gamepad2, 8, ["home"]),
  w("drink", "drink", "पीना", GlassWater, 8, ["home"]),
  w("eat", "eat", "खाना", Apple, 8, ["home"], { morning: 0.7, evening: 0.9 }),
  w("milk", "milk", "दूध", Milk, 4, ["home"], { morning: 0.9, night: 0.8 }),
  w("water", "water", "पानी", GlassWater, 5, ["home"]),
  w("banana", "banana", "केला", Banana, 3, ["home"], { morning: 0.8 }),
  w("eggs", "eggs", "अंडा", Egg, 3, ["home"], { morning: 0.9 }),
  w("roti", "roti", "रोटी", Cookie, 3, ["home"], { evening: 0.9 }),
  w("fruit", "fruit", "फल", Grape, 3, ["home"]),
  w("biscuit", "biscuit", "बिस्कुट", Cookie, 2, ["home"]),
  w("cake", "cake", "केक", Cake, 2, ["home"]),
  w("telly", "telly", "टीवी", Tv, 5, ["home"], { evening: 0.9, night: 0.7 }),
  w("music", "music", "संगीत", Music, 4, ["home"]),
  w("outside", "outside", "बाहर", Trees, 6, ["home"], { morning: 0.8, evening: 0.8 }),
  w("walk", "walk", "टहलना", Footprints, 6, ["home"], { morning: 0.8, evening: 0.7 }),
  w("bedtime", "bedtime", "सोना", BedDouble, 7, ["home"], { night: 1, evening: 0.6 }),
  w("story", "story", "कहानी", BookOpen, 5, ["home"], { night: 0.9, evening: 0.6 }),
  w("moon", "moon", "चाँद", Moon, 2, ["home"], { night: 1 }),
  w("dog", "dog", "कुत्ता", Dog, 3, ["home"]),
  w("hug", "hug", "गले लगाना", Heart, 6, ["home"]),
  w("sofa", "sofa", "सोफ़ा", Sofa, 2, ["home"]),
  w("car", "car", "कार", Car, 4, ["home"]),
  w("door", "door", "दरवाज़ा", DoorOpen, 4, ["home"]),
  w("fridge", "fridge", "फ्रिज", Refrigerator, 2, ["home"]),
  w("house", "house", "घर", House, 5, ["home"]),
  w("open", "open", "खोलो", DoorOpen, 8, ["home", "school"]),
  w("snack2", "snack", "स्नैक", Croissant, 3, ["school"], { morning: 0.6 }),
  w("wash", "wash", "धोना", CupSoda, 4, ["home"]),
  w("bath2", "bath", "नहाना", Bath, 6, ["school"]),
  w("bath", "bath", "नहाना", Bath, 6, ["home"], { morning: 0.7, night: 0.7 }),
  w("brush", "brush", "ब्रश", Paintbrush, 3, ["home"], { morning: 0.8, night: 0.8 }),
  w("snack", "snack", "स्नैक", Pizza, 4, ["home"], { evening: 0.8 }),
  w("salad", "salad", "सलाद", Salad, 3, ["home"], { evening: 0.6 }),
  w("ice-cream", "ice cream", "आइस क्रीम", IceCreamCone, 2, ["home"]),

  // ——— School ———
  w("teacher", "teacher", "टीचर", GraduationCap, 6, ["school"]),
  w("friend", "friend", "दोस्त", Handshake, 6, ["school"]),
  w("class", "class", "क्लास", School, 5, ["school"], { morning: 1 }),
  w("book", "book", "किताब", BookOpen, 6, ["school"], { morning: 0.9 }),
  w("write", "write", "लिखना", Pencil, 6, ["school"], { morning: 0.9 }),
  w("read", "read", "पढ़ना", BookOpen, 6, ["school"], { morning: 0.9 }),
  w("draw", "draw", "चित्र", Palette, 5, ["school"]),
  w("paint", "paint", "रंग", Paintbrush, 4, ["school"]),
  w("recess", "recess", "गेम का समय", Gamepad2, 7, ["school"]),
  w("lunch", "lunch", "लंच", Utensils, 8, ["school"], { morning: 0.6, evening: 0.5 }),
  w("water-bottle", "water bottle", "बोतल", GlassWater, 5, ["school"]),
  w("backpack", "backpack", "बैग", Backpack, 4, ["school"]),
  w("bus", "bus", "बस", Bus, 6, ["school"], { morning: 0.8, evening: 0.9 }),
  w("home2", "home", "घर", Home, 7, ["school"], { evening: 0.9 }),
  w("answer", "answer", "जवाब", PenLine, 6, ["school"]),
  w("question", "question", "सवाल", ScanLine, 5, ["school"]),
  w("understand", "understand", "समझ गया", Brain, 7, ["school"]),
  w("dont-understand", "don't understand", "समझ नहीं आया", Brain, 9, ["school"]),
  w("again", "again", "फिर से", RotateCcw, 8, ["school"]),
  w("finished", "finished", "हो गया", CircleCheck, 7, ["school"]),
  w("prize", "prize", "इनाम", Trophy, 3, ["school"]),
  w("star", "star", "स्टार", Star, 3, ["school"]),
  w("bell", "bell", "घंटी", Bell, 4, ["school"]),
  w("puzzle", "puzzle", "पहेली", Puzzle, 3, ["school"]),
  w("blocks", "blocks", "ब्लॉक्स", Blocks, 3, ["school"]),
  w("drum", "drum", "ड्रम", Drum, 2, ["school"]),
  w("quiet", "quiet", "शांति", Headphones, 8, ["school"]),
  w("music2", "music", "संगीत", Music, 3, ["school"]),
  w("game", "game", "खेल", Gamepad2, 4, ["school"]),
  w("hurt2", "hurt", "चोट", Bandage, 9, ["school"]),
  w("want", "want", "चाहिए", Hand, 9, ["school"]),

  // ——— Clinic ———
  w("doctor", "doctor", "डॉक्टर", Stethoscope, 6, ["clinic"]),
  w("nurse", "nurse", "नर्स", Cross, 6, ["clinic"]),
  w("injection", "injection", "सुई", Syringe, 8, ["clinic"]),
  w("medicine", "medicine", "दवा", Pill, 8, ["clinic"]),
  w("check", "check", "जाँच", ScanLine, 5, ["clinic"]),
  w("hurt", "hurt", "दर्द", Bandage, 10, ["clinic"]),
  w("hurts-here", "hurts here", "यहाँ दर्द", HeartPulse, 10, ["clinic"]),
  w("head", "head", "सिर", Brain, 6, ["clinic"]),
  w("tummy", "tummy", "पेट", Soup, 6, ["clinic"]),
  w("ear", "ear", "कान", Ear, 6, ["clinic"]),
  w("throat", "throat", "गला", Wind, 5, ["clinic"]),
  w("fever", "fever", "बुखार", Thermometer, 7, ["clinic"]),
  w("cough", "cough", "खाँसी", Wind, 6, ["clinic"]),
  w("dizzy", "dizzy", "चक्कर", Snail, 6, ["clinic"]),
  w("sick", "sick", "बीमार", Hospital, 7, ["clinic"]),
  w("scared", "scared", "डर", HeartCrack, 8, ["clinic"]),
  w("slow-down", "slow down", "धीरे", Snail, 8, ["clinic"]),
  w("not-ready", "not ready", "अभी नहीं", CirclePause, 9, ["clinic"]),
  w("question2", "question", "सवाल", ScanLine, 5, ["clinic"]),
  w("mum2", "mum", "माँ", Heart, 7, ["clinic"]),
  w("water2", "water", "पानी", GlassWater, 6, ["clinic"]),
  w("bandage", "bandage", "पट्टी", Bandage, 4, ["clinic"]),
  w("ambulance", "ambulance", "एम्बुलेंस", Ambulance, 4, ["clinic"]),
  w("hospital", "hospital", "अस्पताल", Hospital, 4, ["clinic"]),
  w("wait2", "wait", "इंतज़ार", Hourglass, 7, ["clinic"]),
  w("rest", "rest", "आराम", BedDouble, 6, ["clinic"]),
  w("all-done", "all done", "हो गया", CircleCheck, 8, ["clinic"]),
  w("understand2", "understand", "समझ गया", Brain, 6, ["clinic"]),
  w("repeat", "repeat", "फिर बोलो", RotateCcw, 8, ["clinic"]),
  w("heavy", "too heavy", "बहुत भारी", Weight, 5, ["clinic"]),

  // ——— Grandma's House ———
  w("nani", "nani", "नानी", Heart, 6, ["grandma"]),
  w("grandpa", "grandpa", "दादा", User, 6, ["grandma"]),
  w("bunnies", "bunnies", "खरगोश", Rabbit, 5, ["grandma"]),
  w("garden", "garden", "बगिया", Flower2, 6, ["grandma"]),
  w("flowers", "flowers", "फूल", Flower2, 4, ["grandma"]),
  w("roti-fresh", "fresh roti", "गरम रोटी", Wheat, 6, ["grandma"], { morning: 0.8, evening: 0.8 }),
  w("carrots", "carrots", "गाजर", Carrot, 5, ["grandma"]),
  w("tea-time", "tea time", "चाय", CupSoda, 6, ["grandma"], { evening: 0.9 }),
  w("biscuits", "biscuits", "बिस्किट", Cookie, 5, ["grandma"], { evening: 0.8 }),
  w("kheer", "kheer", "खीर", Soup, 6, ["grandma"], { night: 0.8 }),
  w("mithai", "sweet", "मिठाई", Donut, 4, ["grandma"]),
  w("lullaby", "lullaby", "लोरी", Music, 7, ["grandma"], { night: 1 }),
  w("story2", "story", "कहानी", BookOpen, 6, ["grandma"], { night: 0.9 }),
  w("nap", "nap", "झपकी", BedDouble, 6, ["grandma"], { night: 0.8 }),
  w("moon2", "moon", "चाँद", Moon, 4, ["grandma"], { night: 1 }),
  w("cosy", "cosy", "आराम", Heart, 8, ["grandma"]),
  w("miss-you", "miss you", "याद आती है", Heart, 7, ["grandma"]),

  // ——— Calm Corner ———
  w("too-much", "too much", "बहुत ज़्यादा", Wind, 10, ["overwhelmed"]),
  w("quiet2", "quiet", "शांति", Headphones, 10, ["overwhelmed"]),
  w("space", "space", "दूरी", Footprints, 9, ["overwhelmed"]),
  w("alone", "alone", "अकेले", User, 8, ["overwhelmed"]),
  w("deep-breath", "deep breath", "साँस", Wind, 9, ["overwhelmed"]),
  w("dark", "dark room", "कम रोशनी", LightbulbOff, 9, ["overwhelmed"]),
  w("hug2", "hug", "गले लगाना", Heart, 7, ["overwhelmed"]),
  w("squeeze", "squeeze", "दबाना", Hand, 7, ["overwhelmed"]),
  w("music-quiet", "soft music", "धीमा संगीत", Music, 5, ["overwhelmed"]),
  w("rain", "rain sound", "बारिश", CloudRain, 4, ["overwhelmed"]),
  w("waves", "waves", "लहरें", Waves, 4, ["overwhelmed"]),
  w("water3", "water", "पानी", GlassWater, 6, ["overwhelmed"]),
  w("weighted", "heavy blanket", "भारी कंबल", BedDouble, 6, ["overwhelmed"]),
  w("go-out", "go out", "बाहर", DoorOpen, 8, ["overwhelmed"]),
  w("car-ride", "car ride", "कार", Car, 5, ["overwhelmed"]),
  w("not-now", "not now", "अभी नहीं", CirclePause, 10, ["overwhelmed"]),
  w("later", "later", "बाद में", Clock, 8, ["overwhelmed"]),
  w("cant-talk", "can't talk", "बोल नहीं सकता", VolumeX, 9, ["overwhelmed"]),
  w("come-back", "come back", "वापस आओ", RotateCcw, 6, ["overwhelmed"]),
  w("safe", "safe", "सुरक्षित", ShieldCheck, 8, ["overwhelmed"]),
  w("snail2", "slow", "धीमा", Snail, 7, ["overwhelmed"]),
  w("sun", "sunlight", "धूप", Sun, 3, ["overwhelmed"]),
  w("snow", "cool air", "ठंडी हवा", Snowflake, 5, ["overwhelmed"]),
  w("flame", "warmth", "गर्मी", Flame, 3, ["overwhelmed"]),
  w("scared2", "scared", "डर", HeartCrack, 9, ["overwhelmed"]),
  w("angry", "angry", "गुस्सा", Zap, 9, ["overwhelmed"]),
  w("tummy2", "tummy hurts", "पेट दर्द", Soup, 7, ["overwhelmed"]),
  w("no2", "no", "नहीं", Ban, 10, ["overwhelmed"]),
  w("speaker", "noise", "शोर", Speaker, 8, ["overwhelmed"]),
];

export const ALL_WORDS: Word[] = [...ALWAYS_WORDS, ...SCENE_WORDS];

export function wordsForScene(scene: SceneId): Word[] {
  return SCENE_WORDS.filter((word) => word.scenes.includes(scene));
}

export function findWord(id: string): Word | undefined {
  return ALL_WORDS.find((word) => word.id === id);
}

export function wordLabel(word: Word, lang: Lang): string {
  return lang === "hi" ? word.hi : word.en;
}
