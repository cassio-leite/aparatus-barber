import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface BookingItemProps {
  serviceName: string;
  barbershopName: string;
  barbershopImageUrl: string;
  date: Date;
  status?: "confirmado" | "finalizado";
}

const BookingItem = ({
  serviceName,
  barbershopName,
  barbershopImageUrl,
  date,
  status = "confirmado",
}: BookingItemProps) => {
  const isConfirmed = status === "confirmado";

  return (
    <Card className="flex w-full min-w-full flex-row items-center justify-between p-0">
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
  );
};

export default BookingItem;
