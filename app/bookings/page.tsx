import Header from "../_components/header";
import Footer from "../_components/footer";
import BookingItem from "../_components/booking-item";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "../_components/ui/page";
import { getUserBookings } from "../_actions/get-user-bookings";

const BookingsPage = async () => {
  const bookings = await getUserBookings();

  const now = new Date();

  // Separar agendamentos confirmados (data futura) e finalizados (data passada ou cancelados)
  const confirmedBookings = bookings
    .filter((booking) => new Date(booking.date) >= now && !booking.cancelled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ordem crescente (mais próximos primeiro)

  const finishedBookings = bookings
    .filter((booking) => new Date(booking.date) < now || booking.cancelled)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordem decrescente (mais recentes primeiro)

  return (
    <main>
      <Header />
      <PageContainer>
        <PageSection>
          <h1 className="text-foreground text-3xl font-bold">Agendamentos</h1>
        </PageSection>

        {/* Seção CONFIRMADOS */}
        {confirmedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>CONFIRMADOS</PageSectionTitle>
            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  bookingId={booking.id}
                  service={booking.service || undefined}
                  barbershop={booking.barbershop || undefined}
                  serviceName={
                    booking.service?.name || "Serviço não encontrado"
                  }
                  barbershopName={
                    booking.barbershop?.name || "Barbearia não encontrada"
                  }
                  barbershopImageUrl={booking.barbershop?.imageUrl || ""}
                  date={new Date(booking.date)}
                  status="confirmado"
                />
              ))}
            </div>
          </PageSection>
        )}

        {/* Seção FINALIZADOS */}
        {finishedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>FINALIZADOS</PageSectionTitle>
            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  bookingId={booking.id}
                  service={booking.service || undefined}
                  barbershop={booking.barbershop || undefined}
                  serviceName={
                    booking.service?.name || "Serviço não encontrado"
                  }
                  barbershopName={
                    booking.barbershop?.name || "Barbearia não encontrada"
                  }
                  barbershopImageUrl={booking.barbershop?.imageUrl || ""}
                  date={new Date(booking.date)}
                  status="finalizado"
                />
              ))}
            </div>
          </PageSection>
        )}

        {bookings.length === 0 && (
          <PageSection>
            <p className="text-muted-foreground text-center">
              Você não possui agendamentos.
            </p>
          </PageSection>
        )}
      </PageContainer>
      <Footer />
    </main>
  );
};

export default BookingsPage;
