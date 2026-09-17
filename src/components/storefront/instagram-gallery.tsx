"use client";

import { CONTACT } from "@/lib/constants";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const PhotoCard = ({
  src,
  y,
  opacity,
  aspect
}: {
  src: string;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
  aspect: string
}) => (
  <motion.a
    href={CONTACT.instagram}
    target="_blank"
    rel="noopener noreferrer"
    style={{ y, opacity }}
    className={`group relative w-full overflow-hidden rounded-xl bg-muted shadow-lg md:rounded-4xl ${aspect}`}
  >
    <Image
      src={src}
      alt="Portfólio Rosetas"
      fill
      sizes="(max-width: 768px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </motion.a>
);

export function InstagramGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    mass: 1
  });

  const y1 = useTransform(smoothProgress, [0, 0.2, 1], ["100vh", "0vh", "0vh"]);
  const opacity1 = useTransform(smoothProgress, [0, 0.15, 1], [0, 1, 1]);

  const y2 = useTransform(smoothProgress, [0.1, 0.3, 1], ["100vh", "0vh", "0vh"]);
  const opacity2 = useTransform(smoothProgress, [0.1, 0.25, 1], [0, 1, 1]);

  const y3 = useTransform(smoothProgress, [0.2, 0.4, 1], ["100vh", "0vh", "0vh"]);
  const opacity3 = useTransform(smoothProgress, [0.2, 0.35, 1], [0, 1, 1]);

  const y4 = useTransform(smoothProgress, [0.3, 0.5, 1], ["100vh", "0vh", "0vh"]);
  const opacity4 = useTransform(smoothProgress, [0.3, 0.45, 1], [0, 1, 1]);

  const y5 = useTransform(smoothProgress, [0.4, 0.6, 1], ["100vh", "0vh", "0vh"]);
  const opacity5 = useTransform(smoothProgress, [0.4, 0.55, 1], [0, 1, 1]);

  const y6 = useTransform(smoothProgress, [0.5, 0.7, 1], ["100vh", "0vh", "0vh"]);
  const opacity6 = useTransform(smoothProgress, [0.5, 0.65, 1], [0, 1, 1]);

  return (
    <section id="portfolio" ref={containerRef} className="relative pb-10 w-full h-[300vh] bg-[#FDFBF7]">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-10 md:flex-row md:justify-between md:px-16 md:pt-0 lg:px-24">

        <div className="mb-10 flex w-full flex-col items-start justify-center gap-6 md:mb-0 md:w-1/2 md:pr-10 lg:pr-12">
          <header>
            <p className="eyebrow mb-2 text-[10px] uppercase tracking-[0.2em] text-primary md:mb-4">
              Portfólio & Inspirações
            </p>
            <h2 className="font-display text-4xl text-deep md:text-5xl lg:text-6xl">
              Acompanhe a <br className="hidden lg:block" /><span className="italic text-primary">criação</span>
            </h2>
          </header>
        </div>

        <div className="flex w-full items-center justify-center md:w-1/2 md:justify-end">
          <div className="grid w-full max-w-sm grid-cols-2 gap-4 md:max-w-md lg:hidden">
            <div className="flex flex-col gap-4 md:gap-6 pt-0">
              <PhotoCard src="/imagem-01.jpg" y={y1} opacity={opacity1} aspect="aspect-[4/5]" />
              <PhotoCard src="/imagem-03.jpg" y={y3} opacity={opacity3} aspect="aspect-[3/4]" />
              <PhotoCard src="/imagem-05.jpeg" y={y5} opacity={opacity5} aspect="aspect-[4/3]" />
            </div>

            <div className="flex flex-col gap-4 md:gap-6 pt-0">
              <PhotoCard src="/imagem-02.jpg" y={y2} opacity={opacity2} aspect="aspect-square" />
              <PhotoCard src="/imagem-04.jpg" y={y4} opacity={opacity4} aspect="aspect-[3/4]" />
              <PhotoCard src="/imagem-06.jpg" y={y6} opacity={opacity6} aspect="aspect-square" />
            </div>
          </div>

          <div className="hidden lg:grid w-full max-w-180 grid-cols-3 gap-6">
            <div className="flex flex-col gap-6 pt-0">
              <PhotoCard src="/imagem-01.jpg" y={y1} opacity={opacity1} aspect="aspect-[3/4]" />
              <PhotoCard src="/imagem-02.jpg" y={y4} opacity={opacity4} aspect="aspect-square" />
            </div>

            <div className="flex flex-col gap-6">
              <PhotoCard src="/imagem-04.jpg" y={y2} opacity={opacity2} aspect="aspect-square" />
              <PhotoCard src="/imagem-03.jpg" y={y5} opacity={opacity5} aspect="aspect-[3/4]" />
            </div>

            <div className="flex flex-col gap-6">
              <PhotoCard src="/imagem-05.jpeg" y={y3} opacity={opacity3} aspect="aspect-[3/4]" />
              <PhotoCard src="/imagem-06.jpg" y={y6} opacity={opacity6} aspect="aspect-square" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}