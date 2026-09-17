import { InstagramIcon, MailIcon, MapPinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { CONTACT } from "@/lib/constants";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-[#FDFBF7] pt-20 pb-8 text-muted-foreground">

      <div className="mx-auto flex flex-col justify-between gap-12 px-6 md:flex-row md:gap-8 lg:px-24 md:px-16">

        <div className="flex w-full flex-col gap-6 md:w-1/3">
          <div className="relative h-12 w-40">
            <Image
              src="/logo-simbolo-rosetas.png"
              alt="Rosetas Personalizados"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            Personalizando seus melhores momentos. Feito à mão, pensado para você e especial para cada momento.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 md:w-1/3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-deep">Contato</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li>
              <a href={CONTACT.whatsappApiUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-primary">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-primary">
                <InstagramIcon /> @rosetapersonalizados
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 transition-colors hover:text-primary">
                <MailIcon /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-col gap-6 md:w-1/3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-deep">Onde Estamos</h4>
          <div className="flex items-start gap-3 text-sm">
            <div className="mt-0.5">
              <MapPinIcon />
            </div>
            <span>{CONTACT.address}</span>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-12">
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} Rosetas Personalizados. Todos os direitos reservados.
          </p>
        </div>
      </div>

    </footer>
  );
}