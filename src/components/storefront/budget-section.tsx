"use client";

import { WhatsAppIcon } from "@/components/ui/icons";
import { CONTACT } from "@/lib/constants";
import Image from "next/image";
import { SyntheticEvent } from "react";

export function BudgetSection() {
  const handleWhatsAppSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const mensagem = `
*NOVO PEDIDO DE ORÇAMENTO* 🤍

*Cliente:* ${formData.get("nome")}
*WhatsApp:* ${formData.get("whatsapp")}
*Produto Desejado:* ${formData.get("produto")}
*Quantidade:* ${formData.get("quantidade")}
*Data do Evento:* ${formData.get("data")}
*Tema/Ocasião:* ${formData.get("tema")}

*Observações:* 
${formData.get("observacoes")}
    `.trim();

    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="orcamento" className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-10 md:flex-row md:justify-between md:px-16 lg:px-24 lg:py-32">

      <div className="pointer-events-none absolute inset-x-0 top-1 z-0 flex justify-end opacity-[0.08] md:hidden">
        <div className="relative aspect-square w-[35%]">
          <Image
            src="/logo-simbolo-rosetas.png"
            alt="Símbolo Rosetas"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full flex-col justify-between gap-16 md:flex-row">

        <header className="flex w-full flex-col pt-8 md:w-5/12 lg:w-1/3">
          <p className="eyebrow mb-4 text-[10px] uppercase tracking-[0.2em] text-primary">
            Orçamento
          </p>
          <h2 className="font-display text-5xl leading-tight text-deep md:text-6xl">
            Vamos criar algo especial?
          </h2>
          <p className="mt-6 font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
            Preencha os campos ao lado e o seu pedido chega prontinho no nosso WhatsApp. Sem compromisso — te respondemos rapidamente.
          </p>
        </header>

        <div className="w-full md:w-7/12 lg:w-2xl">
          <div className="rounded-xl bg-white p-8 shadow-sm md:p-10 lg:p-12">
            <form onSubmit={handleWhatsAppSubmit} className="flex flex-col gap-6">

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nome" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nome *</label>
                  <input required type="text" id="nome" name="nome" placeholder="Seu nome" className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="whatsapp" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">WhatsApp *</label>
                  <input required type="tel" id="whatsapp" name="whatsapp" placeholder="(84) 99999-9999" className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="produto" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Produto Desejado</label>
                  <input
                    type="text"
                    id="produto"
                    name="produto"
                    list="produtos-sugeridos"
                    placeholder="Ex.: Convite, Menu, etc."
                    className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <datalist id="produtos-sugeridos">
                    <option value="Convites" />
                    <option value="Identidade Visual" />
                    <option value="Papelaria" />
                    <option value="Embalagens" />
                    <option value="Mesa & Decoração" />
                  </datalist>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="quantidade" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quantidade</label>
                  <input type="number" id="quantidade" name="quantidade" placeholder="Ex.: 50 unidades" className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="data" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Data do Evento</label>
                  <input type="date" id="data" name="data" className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="tema" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tema / Ocasião</label>
                  <input type="text" id="tema" name="tema" placeholder="Ex.: 15 anos, casamento, formatura..." className="w-full rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="observacoes" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Observações</label>
                <textarea id="observacoes" name="observacoes" rows={4} placeholder="Conte como você imagina (cores, estilo, etc)..." className="w-full resize-none rounded-lg border border-muted bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
              </div>

              <button type="submit" className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                <WhatsAppIcon size={20} className="transition-transform group-hover:scale-110" />
                Solicitar orçamento
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
}