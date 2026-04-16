"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("Senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    const result = await register(nome, email, senha);
    setLoading(false);
    if (result.success) {
      router.push("/login");
    } else {
      setError(result.message || "Erro ao criar conta.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <Card className="w-full max-w-lg border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40">
        <CardHeader>
          <CardTitle>Cadastro - TechRent</CardTitle>
          <CardDescription>Crie uma conta para acessar o sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" required />
            </div>
            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirme sua senha" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/login">
              <Button variant="secondary" className="w-full">Já tenho conta</Button>
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
