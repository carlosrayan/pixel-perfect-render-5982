import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-matchcv";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/_authenticated/configuracoes")({ head: () => ({ meta: [{ title: "Configurações | MatchCV" }, { name: "description", content: "Gerencie sua conta MatchCV." }, { property: "og:title", content: "Configurações | MatchCV" }, { property: "og:description", content: "Gerencie sua conta MatchCV." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: SettingsPage });
function SettingsPage() { const { data: user } = useSession(); async function resetPassword() { if (!user?.email) return; const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: `${window.location.origin}/redefinir-senha` }); if (error) toast.error("Não foi possível enviar o e-mail."); else toast.success("Enviamos as instruções para seu e-mail."); } return <AppShell title="Configurações" description="Dados e segurança da sua conta"><Card className="max-w-2xl"><CardHeader><CardTitle>Conta</CardTitle><CardDescription>Gerencie o acesso ao MatchCV.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>E-mail</Label><Input value={user?.email ?? ""} disabled /></div><Button variant="outline" onClick={resetPassword}>Redefinir senha</Button></CardContent></Card></AppShell>; }