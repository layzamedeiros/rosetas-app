import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-[85svh] md:min-h-svh w-full flex-col justify-start overflow-hidden bg-background px-6 pt-36 md:justify-center mx-auto md:px-12 lg:px-30 md:pt-20">
      <div className="pointer-events-none absolute -right-20 top-20 z-0 opacity-5 md:opacity-60 md:right-25 md:top-40">
        <Image
          src="/logo-simbolo-rosetas.png"
          alt="Símbolo Rosetas"
          width={600}
          height={600}
          sizes="(max-width: 768px) 350px, 600px"
          className="h-87.5 w-auto object-contain md:h-100"
          priority
        />
      </div>

      <header className="relative z-10 max-w-2xl">
        <p className="eyebrow mb-6 font-semibold tracking-[0.15em] text-primary">
          PERSONALIZANDO SEUS MELHORES MOMENTOS
        </p>

        <h1 className="font-display text-5xl leading-[1.1] text-deep md:text-6xl lg:text-7xl">
          Detalhes que transformam momentos em <span className="italic">memórias</span>
        </h1>

        <svg
          className="mb-6 h-4 w-32 text-primary/40 md:mt-6 md:h-5 md:w-30"
          viewBox="0 0 100 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          preserveAspectRatio="none"
        >
          <path d="M0,10 Q25,20 50,10 T100,10" />
        </svg>

        <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          Rosetas personalizados para deixar cada ocasião ainda mais especial feitos à mão, pensados para você.
        </p>
      </header>
    </section>
  );
}