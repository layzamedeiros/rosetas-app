"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function OurEssence() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section id="manifesto" className="relative flex min-h-screen w-full items-center bg-[#FDFBF7] px-6 py-24 md:px-16 lg:px-24">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center md:hidden">
        <div className="relative aspect-square w-[50%] opacity-10">
          <Image
            src="/logo-simbolo-rosetas.png"
            alt="Símbolo Rosetas"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-between gap-12 md:flex-row">
        <div className="w-full md:w-1/2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="flex flex-col gap-8 md:gap-10"
          >
            <header>
              <motion.p variants={itemVariants} className="eyebrow mb-4 text-[10px] uppercase tracking-[0.2em] text-primary">
                O Manifesto
              </motion.p>
              <motion.h2 variants={itemVariants} className="font-display text-4xl leading-tight text-deep md:text-5xl lg:text-6xl">
                O primeiro <span className="italic text-primary">toque</span> <br /> da sua celebração
              </motion.h2>
            </header>

            <div className="flex max-w-xl flex-col gap-6 font-serif text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-loose">
              <motion.p variants={itemVariants}>
                Em um mundo cada vez mais digital, receber algo feito à mão, com relevos delicados e o perfume de cera derretida, é um verdadeiro ato de presença. O convite é a primeira impressão física de uma memória.
              </motion.p>
              <motion.p variants={itemVariants}>
                Seja para um Sim no altar, os mágicos 15 anos ou um novo ciclo. Nós traduzimos a essência da sua história em papel, para que seus convidados sintam a emoção do evento antes mesmo de ele começar.
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className="hidden w-full items-center justify-end md:flex md:w-1/2">
          <div className="relative aspect-square w-full max-w-104 lg:max-w-[24rem] opacity-30">
            <Image
              src="/logo-simbolo-rosetas.png"
              alt="Símbolo Rosetas"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}