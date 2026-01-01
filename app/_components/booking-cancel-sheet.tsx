"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cancelBooking } from "../_actions/cancel-booking";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import PhoneItem from "./phone-item";
import { BarbershopServiceModel } from "../generated/prisma/models/BarbershopService";
import { BarbershopModel } from "../generated/prisma/models/Barbershop";

interface BookingCancelSheetProps {
  bookingId: string;
  service: BarbershopServiceModel;
  barbershop: BarbershopModel;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingCancelSheet = ({
  bookingId,
  service,
  barbershop,
  date,
  open,
  onOpenChange,
}: BookingCancelSheetProps) => {
  const router = useRouter();
  const { executeAsync, isPending } = useAction(cancelBooking);

  const formatPrice = (priceInCents: number) => {
    const priceInReais = priceInCents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInReais);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const now = new Date();
  const isConfirmed = date >= now;

  const handleCancel = async () => {
    const result = await executeAsync({ bookingId });

    if (result.serverError || result.validationErrors) {
      toast.error(
        result.validationErrors?._errors?.[0] || "Erro ao cancelar reserva"
      );
      return;
    }

    toast.success("Reserva cancelada com sucesso!");
    router.refresh();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 [&>button:last-child]:hidden"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
          <SheetTitle className="text-foreground text-lg font-bold">
            Informações da Reserva
          </SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </button>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5 py-6">
          {/* Mapa com card da barbearia */}
          <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
            <Image
              src="/map.png"
              alt="Mapa"
              fill
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4">
  <Card className="p-4 shadow-lg">
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={barbershop.imageUrl} />
      </Avatar>

      <div className="flex flex-col gap-1">
        <p className="font-bold text-foreground">
          {barbershop.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {barbershop.address}
        </p>
      </div>
    </div>
  </Card>
</div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Badge de status */}
            <div>
              <Badge
                variant="outline"
                className={
                  isConfirmed
                    ? "bg-accent/40 text-primary border-accent/60"
                    : "bg-muted text-muted-foreground border-muted"
                }
              >
                {isConfirmed ? "CONFIRMADO" : "FINALIZADO"}
              </Badge>
            </div>

            {/* Card com informações do agendamento */}
            <Card className="bg-muted p-4 shadow-none">
              <div className=" flex items-center justify-between">
                <h4 className="text-foreground font-bold">{service.name}</h4>
                <span className="text-foreground font-bold">
                  {formatPrice(service.priceInCents)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Data</span>
                  <span className="text-foreground text-sm font-medium">
                    {formatDate(date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Horário
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {formatTime(date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Barbearia
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {barbershop.name}
                  </span>
                </div>
              </div>
            </Card>

            {/* Telefones */}
            <div className="space-y-3">
              {barbershop.phones.map((phone, index) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer com botões */}
        <SheetFooter className="px-5 py-">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-full"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar Reserva
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookingCancelSheet;

