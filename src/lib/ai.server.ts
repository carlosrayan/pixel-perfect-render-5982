const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type AIMessage = { role: "system" | "user"; content: string };

/**
 * Chama o Lovable AI Gateway e devolve um objeto JSON já parseado.
 */
export async function askForJson<T>(messages: AIMessage[]): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Serviço de IA indisponível no momento.");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (response.status === 429) {
    throw new Error("Muitas análises seguidas. Aguarde alguns instantes e tente novamente.");
  }
  if (response.status === 402) {
    throw new Error("Os créditos de IA do projeto acabaram.");
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error("AI gateway error", response.status, detail);
    throw new Error("Não foi possível concluir a análise agora.");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content ?? "";
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("A resposta da análise veio em formato inesperado.");
  }
}
