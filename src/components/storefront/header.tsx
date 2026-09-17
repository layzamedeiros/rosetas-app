"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = () => {
    document.body.style.overflow = "unset";
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Produtos", href: "/produtos" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Portfólio", href: "#portfolio" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-4 z-50 mx-auto max-w-5xl md:max-w-full md:px-12 lg:px-24 px-4 transition-all duration-500 ease-in-out",
          isVisible || isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center justify-between rounded-full transition-all duration-300",
            isMobileMenuOpen
              ? "border-transparent bg-transparent px-2"
              : "border border-border/50 bg-background/80 px-6 backdrop-blur-md"
          )}
        >
          <Link
            href="/"
            onClick={handleMobileLinkClick}
            className="relative z-50 shrink-0 transition-opacity hover:opacity-70"
          >
            <Image
              src="/logo-rosetas.svg"
              alt="Rosetas"
              width={120}
              height={32}
              sizes="120px"
              className="h-auto w-auto md:w-30 object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#orcamento"
              className="rounded-full bg-primary/10 px-5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Fazer Orçamento
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 flex h-9 w-9 flex-col items-start justify-center gap-1.25 text-foreground outline-none md:hidden"
            aria-label="Menu"
          >
            <span className={cn("h-0.5 rounded-full bg-current transition-all duration-300", isMobileMenuOpen ? "w-6 translate-y-[7.5px] rotate-45" : "w-4")} />
            <span className={cn("h-[2.5px] rounded-full bg-current transition-all duration-300", isMobileMenuOpen ? "w-0 opacity-0" : "w-6")} />
            <span className={cn("h-[2.5px] rounded-full bg-current transition-all duration-300", isMobileMenuOpen ? "w-6 translate-y-[-7.5px] -rotate-45" : "w-5")} />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-background px-8 pb-10 pt-32 transition-all duration-500 md:hidden",
          isMobileMenuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-col items-start gap-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleMobileLinkClick}
              style={{ transitionDelay: `${index * 50}ms` }}
              className={cn(
                "font-display text-2xl font-medium text-deep transition-all duration-500 hover:text-primary",
                isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="#orcamento"
            onClick={handleMobileLinkClick}
            className={cn(
              "mt-auto flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-700 hover:bg-primary/90",
              isMobileMenuOpen ? "translate-y-0 opacity-100 delay-300" : "translate-y-8 opacity-0"
            )}
          >
            Solicitar orçamento
          </Link>
        </nav>
      </div>
    </>
  );
}