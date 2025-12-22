"use client";

import { useRouter } from "next/navigation";
import { Home, Calendar, LogOut, LogIn, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetClose } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MenuSheet = ({ open, onOpenChange }: MenuSheetProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    onOpenChange(false);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  const categories = [
    "Cabelo",
    "Barba",
    "Acabamento",
    "Sombrancelha",
    "Massagem",
    "Hidratação",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 [&>button:last-child]:hidden"
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-foreground text-lg font-semibold">Menu</h2>
          <SheetClose className="opacity-70 transition-opacity hover:opacity-100">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
        <Separator />

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="px-5 pb-5">
            {/* Seção de Login/Perfil do Usuário */}
            <div className="pb-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground font-semibold">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Olá. Faça seu login!
                  </span>
                  <Button
                    onClick={handleLogin}
                    size="default"
                    className="rounded-full"
                  >
                    Login
                    <LogIn className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Navegação Principal */}
            <div className="space-y-2 py-4">
              <button
                onClick={() => handleNavigate("/")}
                className="flex w-full items-center gap-3 py-2 text-left transition-opacity hover:opacity-70"
              >
                <Home className="text-foreground size-5" />
                <span className="text-foreground font-medium">Início</span>
              </button>
              <button
                onClick={() => handleNavigate("/bookings")}
                className="flex w-full items-center gap-3 py-2 text-left transition-opacity hover:opacity-70"
              >
                <Calendar className="text-foreground size-5" />
                <span className="text-foreground font-medium">
                  Agendamentos
                </span>
              </button>
            </div>
          </div>
          <Separator />
          <div className="px-5 pb-5">
            {/* Categorias de Serviços */}
            <div className="space-y-2 py-4 font-medium">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-foreground block w-full py-2 text-left transition-opacity hover:opacity-70"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {user && <Separator />}
          {user && (
            <div className="px-5 pt-4 pb-42">
              <button
                onClick={handleLogout}
                className="text-foreground flex w-full items-center gap-3 py-2 text-left transition-opacity hover:opacity-70"
              >
                <LogOut className="size-5" />
                <span>Sair da conta</span>
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
