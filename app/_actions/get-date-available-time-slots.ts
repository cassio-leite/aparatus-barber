"use server";

import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { endOfDay, format, startOfDay } from "date-fns";
import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";
import { auth } from "@/lib/auth";

const inputSchema = z.object({
  barbershopId: z.string(),
  date: z.date(),
});

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

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });
    const occupiedSlots = bookings.map((booking) =>
      format(booking.date, "HH:mm"),
    );
    const availableTimeSlots = generateTimeSlots().filter(
      (slot) => !occupiedSlots.includes(slot),
    );
    return availableTimeSlots;
  });

  // Toda barbearia vai ter horários das 09h às 18h.
  // Todo serviço vai ocupar 30 minutos.
