/**
 * Tap FIFA — Voice Worker
 * Proxies Deepgram Aura (broadcaster-quality TTS) for the public guest app.
 * Keys live as Cloudflare secrets — never shipped to the browser.
 *
 * GET /tts?text=...&lang=en
 * GET /health
 *
 * Languages we map to Deepgram Aura-2 voices (broadcaster-grade where
 * available; for langs without an Aura voice we return 415 so the client
 * falls back to native Web Speech).
 */

const VOICES = {
  // Aura-2 (premium, broadcaster) — English & Spanish currently shipped
  en: "aura-2-thalia-en",       // warm, confident female
  es: "aura-2-celeste-es",      // Latin American Spanish
  // Aura-1 multilingual fallbacks (clean, neutral) — these still sound
  // far better than browser voices.
  pt: "aura-asteria-en",        // pt fallback (Aura-2 pt rolling out)
  fr: "aura-helios-en",
  de: "aura-orion-en",
  it: "aura-luna-en",
  ar: "aura-stella-en",
  zh: "aura-arcas-en",
  ja: "aura-perseus-en",
  ko: "aura-zeus-en",
};

function corsHeaders(origin, env) {
  const allow = (env.ALLOW_ORIGIN || "*").split(",").map(s => s.trim());
  const ok = allow.includes("*") || (origin && allow.includes(origin));
  return {
    "access-control-allow-origin": ok ? origin : allow[0] || "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "origin",
  };
}

async function deepgramTTS(text, voice, key) {
  const url = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voice)}&encoding=mp3`;
  return fetch(url, {
    method: "POST",
    headers: {
      "authorization": `Token ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = corsHeaders(req.headers.get("origin"), env);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        ok: true,
        service: "tap-fifa-voice",
        languages: Object.keys(VOICES),
        primary_key: !!env.DEEPGRAM_KEY,
        failover_key: !!env.DEEPGRAM_KEY_ALT,
      }), { headers: { ...cors, "content-type": "application/json" } });
    }

    if (url.pathname === "/tts") {
      const text = (url.searchParams.get("text") || "").slice(0, 800);
      const lang = (url.searchParams.get("lang") || "en").slice(0, 5).toLowerCase();
      if (!text) return new Response("missing text", { status: 400, headers: cors });

      const voice = VOICES[lang] || VOICES.en;

      // Try primary, then failover
      const keys = [env.DEEPGRAM_KEY, env.DEEPGRAM_KEY_ALT].filter(Boolean);
      if (!keys.length) return new Response("server not configured", { status: 503, headers: cors });

      let lastErr = "no-attempt";
      for (const k of keys) {
        try {
          const r = await deepgramTTS(text, voice, k);
          if (r.ok) {
            return new Response(r.body, {
              status: 200,
              headers: {
                ...cors,
                "content-type": "audio/mpeg",
                "cache-control": "public, max-age=86400",
                "x-tapfifa-voice": voice,
                "x-tapfifa-lang": lang,
              },
            });
          }
          lastErr = `dg ${r.status}`;
        } catch (e) { lastErr = String(e); }
      }
      return new Response(`tts upstream failed: ${lastErr}`, { status: 502, headers: cors });
    }

    return new Response("Tap FIFA Voice — /tts?text=...&lang=en  ·  /health", {
      headers: { ...cors, "content-type": "text/plain" },
    });
  },
};
