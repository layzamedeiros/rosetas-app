import { ToastProvider } from "@/components/providers/toast-provider";
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rosetas Personalizados",
    default: "Rosetas Personalizados",
  },
  description:
    "Papelaria, convites e identidade visual para casamentos, 15 anos, formaturas e eventos corporativos. Detalhes feitos à mão que eternizam a sua história.",
  keywords: [
    "papelaria para eventos",
    "personalizados",
    "convites",
    "identidade visual",
    "eventos",
    "papelaria personalizada",
    "lembranças",
    "15 anos",
    "casamento",
    "eventos corporativos",
  ],
  openGraph: {
    title: "Rosetas Personalizados | Personalizando seus melhores momentos",
    description:
      "Detalhes feitos à mão que transformam momentos em memórias. Convites e identidade visual para eventos inesquecíveis.",
    url: "https://rosetaspersonalizados.com.br",
    siteName: "Rosetas Personalizados",
    images: [
      {
        url: "/logo-simbolo-rosetas.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}