"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { MonitorSmartphone, LogIn, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const authContext = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  if (!authContext) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const { login } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const success = await login(email, senha);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("E-mail ou senha inválidos. Verifique suas credenciais.");
      }
    } catch (err) {
      setError("E-mail ou senha inválidos. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 ring-1 ring-cyan-500/30 mx-auto mb-4">
            <MonitorSmartphone className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo ao TechRent</h1>
          <p className="text-slate-400 mt-1 text-sm">Acesse sua conta para gerenciar chamados de TI</p>
        </div>

        <Card className="border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Entrar na conta</CardTitle>
            <CardDescription>Use seu e-mail e senha cadastrados</CardDescription>
          </CardHeader>

          <Separator className="bg-white/5" />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Entrando...</>
                ) : (
                  <><LogIn className="h-4 w-4 mr-2" /> Entrar</>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center space-y-2">
              <p className="text-sm text-slate-400">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-cyan-400 hover:text-cyan-300 font-medium no-underline hover:underline">
                  Criar conta
                </Link>
              </p>
              <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300">
                <Link href="/">← Voltar ao início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}