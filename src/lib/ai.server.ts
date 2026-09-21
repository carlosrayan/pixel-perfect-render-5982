const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";

export type AIMessage = { role: "system" | "user"; content: string };

/**
 * Chama o Lovable AI Gateway e devolve um objeto JSON já parseado.
 */
export async function askForJson<T>(messages: AIMessage[]): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Serviço de IA indisponível no momento.");

  const input = messages.map((message) => ({
    role: message.role,
    content: [{ type: "input_text", text: message.content }],
  }));
  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      input,
      stream: true,
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      store: false,
      text: { format: { type: "json_object" } },
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

  const reader = response.body?.getReader();
  if (!reader) throw new Error("A análise não retornou conteúdo.");
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += decoder.decode(chunk.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
      try {
        const event = JSON.parse(line.slice(6)) as { type?: string; delta?: string };
        if (event.type === "response.output_text.delta") content += event.delta ?? "";
      } catch {
        // Eventos incompletos são ignorados; o próximo bloco continua o stream.
      }
    }
  }
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
