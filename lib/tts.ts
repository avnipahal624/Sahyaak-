/**
 * Browser speech synthesis for the demo — no network call, works offline
 * with the OS voices already on the device. The real build swaps in an
 * on-device TTS engine; the call sites stay the same.
 */

import type { Lang } from "./vocabulary";

export const ttsSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

// Warm the voice list — Chrome populates it asynchronously.
if (ttsSupported) {
  window.speechSynthesis.getVoices();
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!ttsSupported) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const want = lang === "hi" ? "hi" : "en";
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(want)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en"))
  );
}

/** Speak exactly what the child tapped and confirmed — never anything generated. */
export function speak(text: string, lang: Lang, voiceHint?: string) {
  if (!ttsSupported || !text.trim()) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice =
      (voiceHint
        ? window.speechSynthesis
            .getVoices()
            .find((v) => v.name === voiceHint || v.voiceURI === voiceHint)
        : undefined) ?? pickVoice(lang);
    if (voice) utter.voice = voice;
    utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utter.rate = 0.92; // slightly slow and calm
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    // TTS is best-effort; the sentence strip still shows the words
  }
}

export function stopSpeaking() {
  if (!ttsSupported) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
