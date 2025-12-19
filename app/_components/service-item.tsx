import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BarbershopServiceModel } from "../generated/prisma/models/BarbershopService";

interface ServiceItemProps {
  service: BarbershopServiceModel;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  return (
    <Card className="flex flex-row items-center gap-3 p-4 shadow-none">
      {/* Imagem à esquerda */}
      <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>
      {/* Conteúdo à direita */}
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground text-sm font-bold">{service.name}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {service.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground text-sm font-bold">
            {formatPrice(service.priceInCents)}
          </span>
          <Button variant="default" size="sm" className="h-8 rounded-md px-4">
            Reservar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceItem;
