// Teste une clé API Gemini via l'endpoint compatible OpenAI.
// Usage : node scripts/test-gemini.mjs ["votre question"]
// La clé est lue depuis la variable d'environnement GEMINI_API_KEY.

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Erreur : la variable GEMINI_API_KEY n'est pas définie.");
  console.error('Sous Windows : setx GEMINI_API_KEY "VOTRE_CLE" puis rouvrez le terminal.');
  process.exit(1);
}

const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const prompt = process.argv.slice(2).join(" ") || "Dis bonjour en une phrase.";

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  }
);

const data = await res.json().catch(() => ({}));
if (!res.ok) {
  const err = Array.isArray(data) ? data[0]?.error : data?.error;
  console.error(`Erreur HTTP ${res.status} : ${err?.message ?? JSON.stringify(data)}`);
  process.exit(1);
}

console.log(`[${model}] ${data.choices?.[0]?.message?.content ?? "(réponse vide)"}`);
