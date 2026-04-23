"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { MonitorSmartphone, UserPlus, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const authContext = useAuth();
  const router = useRouter();

  if (!authContext) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const { register } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nome || !email || !senha) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    const result = await register(nome, email, senha);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(result.message || "Erro ao criar conta.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <Card className="w-full max-w-md border border-green-500/20 bg-slate-900/90 text-center">
          <CardContent className="pt-8 pb-6 px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Conta criada com sucesso!</h3>
            <p className="text-sm text-slate-400">Redirecionando para o login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-500/30 mx-auto mb-4">
            <MonitorSmartphone className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Criar conta no TechRent</h1>
          <p className="text-slate-400 mt-1 text-sm">Cadastre-se para acessar o sistema de chamados</p>
        </div>

        <Card className="border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Nova conta</CardTitle>
            <CardDescription>Preencha seus dados para se cadastrar</CardDescription>
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
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>

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
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Cadastrando...</>
                ) : (
                  <><UserPlus className="h-4 w-4 mr-2" /> Criar Conta</>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center space-y-2">
              <p className="text-sm text-slate-400">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium no-underline hover:underline">
                  Fazer login
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
