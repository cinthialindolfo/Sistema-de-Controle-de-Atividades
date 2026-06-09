'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="bg-primary p-3.5 rounded-2xl shadow-2xl shadow-primary/20 ring-4 ring-background">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">ActivityControl</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enterprise Edition</p>
          </div>
        </div>
        
        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Boas-vindas</CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-medium">
              Entre com seus dados para gerenciar suas demandas.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground/80 font-bold text-xs uppercase tracking-wider ml-1">Nome</Label>
                  <div className="relative group">
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      placeholder="João" 
                      required 
                      className="pl-10 h-11 bg-background/50 border-border group-hover:border-primary/50 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                    <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground/80 font-bold text-xs uppercase tracking-wider ml-1">Sobrenome</Label>
                  <div className="relative group">
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Silva" 
                      required 
                      className="pl-10 h-11 bg-background/50 border-border group-hover:border-primary/50 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                    />
                    <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-foreground/80 font-bold text-xs uppercase tracking-wider ml-1">PIN de Acesso</Label>
                <div className="relative group">
                  <Input 
                    id="pin" 
                    name="pin" 
                    type="password" 
                    placeholder="••••" 
                    maxLength={4} 
                    required 
                    className="pl-10 h-11 bg-background/50 border-border group-hover:border-primary/50 focus:border-primary focus:ring-primary/20 tracking-[0.6em] font-mono text-lg transition-all rounded-xl"
                  />
                  <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground px-1 italic">Dica: Use 4 dígitos numéricos.</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all rounded-xl active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar no Sistema"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 flex flex-col items-center space-y-2">
          <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-tighter">
            Plataforma de Alta Performance
          </p>
          <div className="h-1 w-12 bg-border rounded-full" />
        </div>
      </div>
    </div>
  );
}
