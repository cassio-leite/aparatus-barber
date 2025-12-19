import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/app/_components/ui/page";
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import Footer from "@/app/_components/footer";
import { Separator } from "@/app/_components/ui/separator";
import ServiceItem from "@/app/_components/service-item";
import PhoneItem from "@/app/_components/phone-item";

interface BarbershopPageProps {
  params: Promise<{ id: string }>;
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const { id } = await params;
  const barbershop = await prisma.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });
  if (!barbershop) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
        />
        {/* Botão de voltar */}
        <div className="absolute top-5 left-5 z-10">
          <Link href="/">
            <Button
              variant="secondary"
              size="icon"
              className="bg-background hover:bg-background/90 h-10 w-10 rounded-full"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
        </div>
        {/* Fundo branco arredondado sobrepondo */}
        <div className="bg-background absolute right-0 bottom-0 left-0 rounded-t-[20px]" />
      </div>

      <PageContainer>
        {/* Informações da Barbearia */}
        <PageSection>
          <div className="flex items-center gap-3 pb-4">
            <Avatar className="size-[30px]">
              <AvatarImage src={barbershop.imageUrl} alt={barbershop.name} />
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-foreground text-xl leading-tight font-bold">
                {barbershop.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {barbershop.address}
              </p>
            </div>
          </div>
        </PageSection>
      </PageContainer>

      {/* Separador ocupando toda a largura */}
      <div className="w-full">
        <Separator />
      </div>

      <PageContainer>
        {/* Seção "SOBRE NÓS" */}
        <PageSection>
          <PageSectionTitle>SOBRE NÓS</PageSectionTitle>
          <p className="text-foreground text-sm leading-relaxed">
            {barbershop.description}
          </p>
        </PageSection>
      </PageContainer>

      {/* Separador ocupando toda a largura */}
      <div className="w-full">
        <Separator />
      </div>

      <PageContainer>
        {/* Seção "SERVIÇOS" */}
        <PageSection>
          <PageSectionTitle>SERVIÇOS</PageSectionTitle>
          <div className="flex flex-col gap-3">
            {barbershop.services.map((service) => (
              <ServiceItem key={service.id} service={service} />
            ))}
          </div>
        </PageSection>
      </PageContainer>

      {/* Separador ocupando toda a largura */}
      <div className="w-full">
        <Separator />
      </div>

      <PageContainer>
        {/* Seção "CONTATO" */}
        <PageSection>
          <PageSectionTitle>CONTATO</PageSectionTitle>
          <div className="flex flex-col gap-3">
            {barbershop.phones.map((phone: string, index: number) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </PageSection>
      </PageContainer>

      <Footer />
    </main>
  );
};

export default BarbershopPage;
