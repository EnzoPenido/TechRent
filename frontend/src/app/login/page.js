"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authContext = useAuth();
  const router = useRouter();

  if (!authContext) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const { login } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, senha);
    setLoading(false);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <Card className="w-full max-w-lg border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
        <CardHeader>
          <CardTitle>Login - TechRent</CardTitle>
          <CardDescription>Use suas credenciais para acessar o painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/cadastro">
              <Button variant="secondary" className="w-full">Criar Conta</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">Voltar à Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}