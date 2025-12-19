"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "./ui/button";

interface PhoneItemProps {
  phone: string;
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar telefone:", err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Phone className="text-foreground size-4" />
        <span className="text-foreground text-sm">{phone}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopyPhone}
        className="bg-background"
      >
        {copied ? "Copiado!" : "Copiar"}
      </Button>
    </div>
  );
};

export default PhoneItem;
