import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo-rosetas.svg"
            width={160}
            height={50}
            alt="Rosetas"
            className="mb-6 h-auto w-40 object-contain"
            priority
          />
          <h1 className="font-display text-2xl text-deep">Acesso ao Painel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insira suas credenciais para gerenciar a papelaria.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}