"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "O Primeiro Contato",
      description: "Navegue pela nossa vitrine ou traga suas referências. Queremos ouvir o que você tem em mente para a sua celebração.",
      color: "bg-[#FDFBF7]",
    },
    {
      number: "02",
      title: "Design e Imaginação",
      description: "Paleta de cores, tipografia e formato. Nossa equipe mapeia cada detalhe para que o projeto reflita a essência de vocês.",
      color: "bg-[#F7F4ED]",
    },
    {
      number: "03",
      title: "Proposta e Alinhamento",
      description: "Enviamos o orçamento detalhado e alinhamos a criação da arte através de um atendimento próximo pelo WhatsApp.",
      color: "bg-[#F0ECE1]",
    },
    {
      number: "04",
      title: "Produção Artesanal",
      description: "Mãos à obra. Impressão de alta qualidade, acabamentos manuais, sinetes de cera e embalagem perfumada até chegar a você.",
      color: "bg-primary",
      isDark: true,
    },
  ];

  return (
    <section id="como-funciona" className="mx-auto px-4 md:px-12 lg:px-30 ">
      <header className="mb-16 md:mb-24">
        <p className="eyebrow mb-4 text-[10px] uppercase tracking-[0.2em] text-primary">
          A ARTE DA PERSONALIZAÇÃO
        </p>
        <h2 className="font-display text-4xl leading-tight text-deep md:text-5xl lg:text-6xl">
          Simples do começo ao fim
        </h2>
      </header>

      <div className="relative pb-8 gap-12 md:pb-[30vh]">
        {steps.map((step, index) => (
          <div
            key={index}
            className="sticky w-full transition-all duration-800"
            style={{
              top: `calc(100px + ${index * 24}px)`,
              zIndex: index + 10
            }}
          >
            <div
              className={cn(
                "relative flex min-h-80 w-full flex-col justify-between overflow-hidden rounded-3xl border border-black/5 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:min-h-100 md:p-12 lg:p-16",
                step.color,
                step.isDark ? "text-primary-foreground" : "text-deep"
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
              />

              <div className="relative z-10 flex justify-between flex-row items-center">
                <span
                  className={cn(
                    "font-display text-7xl md:text-8xl lg:text-9xl",
                    step.isDark ? "text-primary-foreground/20" : "text-primary/10"
                  )}
                >
                  {step.number}
                </span>

                {step.isDark && (
                  <div className="relative mt-4 flex h-12 w-12 overflow-hidden rounded-full bg-white/10 backdrop-blur-md md:mt-0 md:h-16 md:w-16">
                    <Image
                      src="/logo-simbolo-rosetas.png"
                      alt="Símbolo Rosetas"
                      fill
                      sizes="(max-width: 768px) 48px, 64px"
                      className="object-contain p-2 opacity-80 transition-opacity duration-300 hover:opacity-100"
                    />
                  </div>
                )}
              </div>

              <div className="relative z-10 mt-12 lg:w-2/3 md:mt-16">
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl">
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed md:text-base",
                    step.isDark ? "text-primary-foreground/90" : "text-muted-foreground"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}