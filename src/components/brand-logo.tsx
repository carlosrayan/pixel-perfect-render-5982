import { cn } from "@/lib/utils";

/** Nome do produto centralizado — fácil de trocar depois. */
export const APP_NAME = "MatchCV";
export const APP_TAGLINE = "Seu currículo alinhado à vaga certa.";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
        M
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">{APP_NAME}</span>
    </span>
  );
}
