"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { BarbershopServiceModel } from "../generated/prisma/models/BarbershopService";
import { BarbershopModel } from "../generated/prisma/models/Barbershop";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAction } from "next-safe-action/hooks";
import { createBooking } from "../_actions/creat-booking";
import { toast } from "sonner";

interface ServiceItemProps {
  service: BarbershopServiceModel;
  barbershop: BarbershopModel;
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const { executeAsync, isPending } = useAction(createBooking);

  const formatPrice = (priceInCents: number) => {
    // Converter centavos para reais com centavos (R$50,00)
    const priceInReais = priceInCents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInReais);
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      // Horários de 15 em 15 minutos
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:15`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
      slots.push(`${hour.toString().padStart(2, "0")}:45`);
    }
    // Adicionar 18:00 como último horário
    slots.push("18:00");
    return slots;
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Reset states ao fechar
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Reset horário quando mudar a data
    setSelectedTime(undefined);
  };

  const isConfirmDisabled = !selectedDate || !selectedTime;

  // Obter data de hoje sem hora (apenas data)
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const timeSlots = generateTimeSlots();

  const handleConfirm = async () => {
    if (!selectedTime || !selectedDate) {
      return;
    }
    const timeSplitted = selectedTime.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];
    const date = new Date(selectedDate);
    date.setHours(Number(hours), Number(minutes));
    
      const result = await executeAsync({
        serviceId: service.id,
        date,
      });

      if (result.serverError || result.validationErrors) {
        toast.error(result.validationErrors?._errors?.[0]);
        return;
      }
      toast.success("Agendamento criado com sucesso!");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setIsSheetOpen(false);
    
  };

  return (
    <>
      <Card className="flex min-w- flex-row items-center gap-3 p-4 shadow-none">
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
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-foreground truncate text-sm font-bold">
              {service.name}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {service.description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground shrink-0 text-sm font-bold">
              {formatPrice(service.priceInCents)}
            </span>
            <Button
              className="rounded-full px-4 py-2"
              onClick={() => setIsSheetOpen(true)}
            >
              Reservar
            </Button>
          </div>
        </div>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="flex flex-col p-0 [&>button:last-child]:hidden"
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
            <SheetTitle className="text-foreground text-lg font-bold">
              Fazer Reserva
            </SheetTitle>
            <button
              onClick={() => handleSheetOpenChange(false)}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="size-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </SheetHeader>

          {/* Conteúdo Principal */}
          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Calendário */}
            <div className="mb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ before: getTodayDate() }}
                className="rounded-md [&_.rdp-button[data-selected-single='true']]:rounded-md"
                locale={ptBR}
              />
            </div>

            {/* Separator entre Calendário e Horários */}
            {selectedDate && (
              <div className="mb-6">
                <Separator className="bg-border/20" />
              </div>
            )}

            {/* Horários */}
            {selectedDate && (
              <div className="mb-6">
                <div className="mb-3">
                  <h3 className="text-foreground text-sm font-semibold">
                    Horários disponíveis
                  </h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      className={`h-9 shrink-0 px-4 ${
                        selectedTime === time ? "rounded-lg" : "rounded-md"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Separator entre Horários e Card de Informações */}
            {selectedTime && selectedDate && (
              <div className="mb-6">
                <Separator className="bg-border/20" />
              </div>
            )}

            {/* Card de Informações */}
            {selectedTime && selectedDate && (
              <Card className="bg-muted/50 p-4 shadow-none">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-foreground font-bold">{service.name}</h4>
                  <span className="text-foreground font-bold">
                    {formatPrice(service.priceInCents)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Data</span>
                    <span className="text-foreground text-sm font-medium">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Horário
                    </span>
                    <span className="text-foreground text-sm font-medium">
                      {selectedTime}
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
            )}
          </div>

          {/* Footer */}
          <SheetFooter className="border-t px-5 py-4">
            <Button
              variant="default"
              className="w-full rounded-full"
              disabled={isConfirmDisabled || isPending}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ServiceItem;
