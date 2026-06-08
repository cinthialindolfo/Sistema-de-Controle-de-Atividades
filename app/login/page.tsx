'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Ocorreu um erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Bem-vindo</CardTitle>
            <CardDescription className="text-slate-500">
              Entre com seu nome, sobrenome e o PIN de 4 dígitos. No primeiro acesso, seus dados serão salvos.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-4 h-4" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">Nome</Label>
                  <div className="relative">
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      placeholder="Ex: João" 
                      required 
                      className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    />
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">Sobrenome</Label>
                  <div className="relative">
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Ex: Silva" 
                      required 
                      className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    />
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-slate-700 font-medium">PIN de 4 dígitos</Label>
                <div className="relative">
                  <Input 
                    id="pin" 
                    name="pin" 
                    type="password" 
                    placeholder="••••" 
                    maxLength={4} 
                    required 
                    className="pl-10 h-12 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 tracking-[0.5em] font-mono text-lg transition-all"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Acessar Sistema"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="mt-8 text-center text-slate-500 text-sm">
          Acesso restrito para colaboradores autorizados.
        </p>
      </div>
    </div>
  );
}
