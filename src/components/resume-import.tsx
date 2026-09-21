import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseResumeTextFn } from "@/lib/matchcv.functions";
import { extractTextFromFile } from "@/lib/file-text";
import { newId, type ProfileData } from "@/lib/matchcv-types";

type Imported = Partial<ProfileData>;

function withIds<T extends object>(items: unknown): (T & { id: string })[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({ ...(item as T), id: newId() }));
}

export function ResumeImport({ onImported }: { onImported: (data: Imported) => void }) {
  const parseResume = useServerFn(parseResumeTextFn);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      if (text.length < 40) {
        throw new Error("Não conseguimos ler texto nesse arquivo. Ele pode ser uma imagem.");
      }
      const parsed = (await parseResume({ data: { text } })) as Imported;
      onImported({
        ...parsed,
        experiences: withIds(parsed.experiences),
        education: withIds(parsed.education),
        skills: withIds(parsed.skills),
        languages: withIds(parsed.languages),
        certifications: withIds(parsed.certifications),
        projects: withIds(parsed.projects),
        links: withIds(parsed.links),
      } as Imported);
      setDone(true);
      toast.success("Currículo importado. Confira seus dados antes de continuar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível importar o arquivo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Já tenho um currículo</p>
          <p className="text-sm text-muted-foreground">
            Envie um arquivo PDF ou DOCX e preenchemos os campos para você revisar.
          </p>
        </div>
        <Button type="button" variant="outline" disabled={loading} onClick={() => inputRef.current?.click()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Lendo arquivo...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Enviar currículo
            </>
          )}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {done ? (
        <Alert className="border-highlight bg-highlight/40">
          <AlertTitle>Confira seus dados antes de continuar.</AlertTitle>
          <AlertDescription>
            As informações vieram do arquivo enviado e podem conter erros. Revise cada campo.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
