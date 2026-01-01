"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import BookingCancelSheet from "./booking-cancel-sheet";
import { BarbershopServiceModel } from "../generated/prisma/models/BarbershopService";
import { BarbershopModel } from "../generated/prisma/models/Barbershop";

interface BookingItemProps {
  bookingId?: string;
  service?: BarbershopServiceModel;
  barbershop?: BarbershopModel;
  serviceName: string;
  barbershopName: string;
  barbershopImageUrl: string;
  date: Date;
  status?: "confirmado" | "finalizado";
}

const BookingItem = ({
  bookingId,
  service,
  barbershop,
  serviceName,
  barbershopName,
  barbershopImageUrl,
  date,
  status = "confirmado",
}: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isConfirmed = status === "confirmado";

  const handleClick = () => {
    if (bookingId && service && barbershop) {
      setIsSheetOpen(true);
    }
  };

  return (
    <>
      <Card
        className="flex w-full min-w-full flex-row items-center justify-between p-0 cursor-pointer"
        onClick={handleClick}
      >
        {/*Esquerda*/}
        <div className="flex flex-1 flex-col gap-4 p-4">
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
          <div className="flex flex-col gap-2">
            <div className="font-bold">{serviceName}</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={barbershopImageUrl} />
              </Avatar>
              <p className="text-muted-foreground text-sm">{barbershopName}</p>
            </div>
          </div>
        </div>
        {/*Direita*/}
        <div className="flex h-full flex-col items-center justify-center border-l p-4 py-3">
          <p className="text-xs capitalize">
            {date.toLocaleDateString("pt-BR", { month: "long" })}
          </p>
          <p className="text-lg font-bold">
            {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
          </p>
          <p className="text-xs">
            {date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Card>

      {bookingId && service && barbershop && (
        <BookingCancelSheet
          bookingId={bookingId}
          service={service}
          barbershop={barbershop}
          date={date}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </>
  );
};

export default BookingItem;
