# Plano de Implementação - Sheet de Reserva de Serviço

## 📋 Análise dos Requisitos

### Objetivo

Implementar um Sheet (painel lateral) que abre ao clicar no botão "Reservar" no componente `ServiceItem`, permitindo ao usuário selecionar data e horário para agendar um serviço.

### Requisitos Funcionais

1. ✅ Abrir Sheet ao clicar em "Reservar"
2. ✅ Exibir calendário usando componente Calendar do shadcn
3. ✅ Ao selecionar data, exibir horários disponíveis (09:00 às 18:00, intervalos de 30min)
4. ✅ Ao selecionar horário, exibir informações do agendamento
5. ✅ Fechar Sheet ao clicar no botão X
6. ✅ Habilitar botão de confirmar apenas quando data E horário estiverem selecionados

### Requisitos Técnicos

- State para data selecionada: `Date | undefined`
- State para horário selecionado: `string | undefined` (formato "09:00")
- Props: `service` (BarbershopServiceModel) e `barbershop` (Barbershop)

---

## 🏗️ Estrutura do Componente

### Arquivo: `app/_components/service-item.tsx`

**Mudanças necessárias:**

1. Converter para componente client-side (`"use client"`)
2. Adicionar prop `barbershop` à interface
3. Adicionar state para controlar abertura do Sheet
4. Integrar Sheet com Calendar e seleção de horários
5. Criar componente interno para o Sheet de reserva

### Estrutura do Sheet

```
Sheet
├── SheetContent (side="right")
│   ├── SheetHeader
│   │   └── SheetTitle: "Fazer Reserva"
│   ├── Conteúdo Principal
│   │   ├── Calendar (modo single)
│   │   ├── Grid de Horários (condicional - só aparece após selecionar data)
│   │   └── Card de Informações (condicional - só aparece após selecionar horário)
│   │       ├── Nome do Serviço
│   │       ├── Preço (em reais inteiros)
│   │       ├── Data selecionada
│   │       ├── Horário selecionado
│   │       └── Nome da Barbearia
│   └── SheetFooter
│       └── Button "Confirmar Reserva" (disabled até data + horário selecionados)
```

---

## 📦 Componentes e Dependências

### Componentes shadcn/ui já disponíveis:

- ✅ `Sheet` - `app/_components/ui/sheet.tsx`
- ✅ `Calendar` - `app/_components/ui/calendar.tsx`
- ✅ `Button` - `app/_components/ui/button.tsx`
- ✅ `Card` - `app/_components/ui/card.tsx`

### Dependências necessárias:

- ✅ `react-day-picker` - já instalado
- ✅ `lucide-react` - já instalado
- ✅ `date-fns` - já instalado (para formatação de datas)

---

## 🔄 Fluxo de Interação

### 1. Estado Inicial

- Sheet fechado
- Nenhuma data selecionada
- Nenhum horário selecionado
- Botão "Confirmar" desabilitado

### 2. Usuário clica em "Reservar"

- Sheet abre
- Calendário é exibido
- Horários ainda não são exibidos

### 3. Usuário seleciona uma data

- State `selectedDate` é atualizado
- Grid de horários aparece abaixo do calendário
- Horários disponíveis: 09:00, 09:30, 10:00, ..., 18:00

### 4. Usuário seleciona um horário

- State `selectedTime` é atualizado
- Card com informações do agendamento aparece
- Botão "Confirmar" é habilitado

### 5. Usuário clica em "Confirmar Reserva"

- (Por enquanto, apenas fecha o Sheet - implementação futura)

### 6. Usuário clica no X

- Sheet fecha
- States são resetados

---

## 💻 Implementação Detalhada

### 1. Atualizar Interface do ServiceItem

```typescript
interface ServiceItemProps {
  service: BarbershopServiceModel;
  barbershop: Barbershop; // NOVA PROP
}
```

**Nota**: Será necessário atualizar o uso do `ServiceItem` em `app/barbershops/[id]/page.tsx` para passar também a prop `barbershop`:

```typescript
// Antes:
<ServiceItem key={service.id} service={service} />

// Depois:
<ServiceItem key={service.id} service={service} barbershop={barbershop} />
```

### 2. States Necessários

```typescript
const [isSheetOpen, setIsSheetOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
```

### 3. Geração de Horários

```typescript
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};
```

### 4. Formatação de Preço

```typescript
const formatPrice = (priceInCents: number) => {
  // Converter centavos para reais inteiros
  const priceInReais = Math.floor(priceInCents / 100);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInReais);
};
```

### 5. Formatação de Data

```typescript
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};
```

### 6. Reset ao Fechar Sheet

```typescript
const handleSheetOpenChange = (open: boolean) => {
  setIsSheetOpen(open);
  if (!open) {
    // Reset states ao fechar
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  }
};
```

---

## 🎨 Estrutura de Layout do Sheet

### Header

- Título: "Fazer Reserva"
- Botão X (já incluído no SheetContent)

### Conteúdo Principal

- **Calendário**: Ocupa largura total, padding adequado
- **Grid de Horários**:
  - Grid responsivo (grid-cols-3 ou grid-cols-4)
  - Botões com estilo similar ao Button variant="outline"
  - Estado ativo quando selecionado
- **Card de Informações**:
  - Exibir apenas quando `selectedTime` estiver definido
  - Layout vertical com informações organizadas
  - Usar cores do tema (foreground, muted-foreground)

### Footer

- Botão "Confirmar Reserva"
- `disabled={!selectedDate || !selectedTime}`
- Variant: "default"
- Largura total

---

## 📝 Checklist de Implementação

### Fase 1: Estrutura Básica

- [ ] Adicionar `"use client"` ao ServiceItem
- [ ] Adicionar prop `barbershop` à interface
- [ ] Importar componentes Sheet necessários
- [ ] Criar state para controlar abertura do Sheet
- [ ] Conectar botão "Reservar" ao Sheet

### Fase 2: Calendário

- [ ] Importar componente Calendar
- [ ] Adicionar Calendar dentro do SheetContent
- [ ] Criar state para data selecionada
- [ ] Configurar Calendar em modo "single"
- [ ] Conectar onSelect ao state

### Fase 3: Horários

- [ ] Criar função para gerar slots de horário
- [ ] Criar grid de botões de horário
- [ ] Exibir horários apenas quando data estiver selecionada
- [ ] Criar state para horário selecionado
- [ ] Implementar seleção de horário

### Fase 4: Informações do Agendamento

- [ ] Criar Card com informações
- [ ] Exibir apenas quando horário estiver selecionado
- [ ] Formatar preço em reais inteiros
- [ ] Formatar data de forma legível
- [ ] Exibir nome do serviço, preço, data, horário e barbearia

### Fase 5: Footer e Validação

- [ ] Criar SheetFooter
- [ ] Adicionar botão "Confirmar Reserva"
- [ ] Implementar lógica de disabled (data + horário)
- [ ] Implementar função de reset ao fechar

### Fase 6: Ajustes Finais

- [ ] Ajustar espaçamentos e padding
- [ ] Verificar responsividade
- [ ] Testar fluxo completo
- [ ] Garantir que cores usam apenas variáveis do tema

---

## 🎯 Considerações de Design

### Cores do Tema

- Usar `text-foreground` para textos principais
- Usar `text-muted-foreground` para textos secundários
- Usar `bg-primary` e `text-primary-foreground` para botões ativos
- Usar `border` para bordas
- Usar `bg-card` para cards

### Espaçamentos

- Seguir padrão do projeto (gap-3, gap-4, p-4, etc.)
- Usar `PageContainer` e `PageSection` como referência

### Responsividade

- Sheet já é responsivo por padrão (max-w-sm em telas maiores)
- Grid de horários: 2 colunas em mobile, 3-4 em desktop

---

## 🔍 Pontos de Atenção

1. **Formatação de Preço**: Garantir que centavos sejam convertidos para reais inteiros (sem decimais)
2. **Formatação de Data**: Usar formato brasileiro legível (ex: "segunda-feira, 15 de janeiro de 2024")
3. **Reset de States**: Sempre resetar ao fechar o Sheet
4. **Validação**: Botão confirmar deve estar disabled até ambos (data + horário) estarem selecionados
5. **Acessibilidade**: Manter labels e aria-labels adequados
6. **Performance**: States locais são suficientes, não precisa de context ou estado global

---

## 📚 Referências

- Componente Sheet: `app/_components/ui/sheet.tsx`
- Componente Calendar: `app/_components/ui/calendar.tsx`
- Exemplo de uso: `app/_components/menu-sheet.tsx` (para referência de estrutura)
- Tema de cores: `app/globals.css`
- Componentes de página: `app/_components/ui/page.tsx`

### Observações do MenuSheet (referência)

- Usa `Sheet` com `open` e `onOpenChange` para controle
- `SheetContent` com `side="right"` e padding customizado
- Estrutura com `flex flex-col` para layout vertical
- Usa `Separator` para divisões visuais
- Botão X customizado com `SheetClose` (o SheetContent já tem um, mas pode ser customizado)

---

## 🎨 Design do Figma

**IMPORTANTE**: O design está em: https://www.figma.com/design/KBlNBjp5XXWUj64ZCiT9lq/Aparatus?node-id=78-1818&m=dev

Ao implementar, seguir **100% fiel** ao design do Figma, incluindo:

- Espaçamentos exatos
- Tamanhos de fonte
- Cores e estilos
- Layout e posicionamento
- Estados visuais (hover, active, disabled)

**Nota**: Como não há acesso direto ao Figma via MCP neste momento, a implementação deve ser baseada na visualização manual do design no link fornecido.

---

## ✅ Próximos Passos

Após implementação:

1. Testar fluxo completo de reserva
2. Verificar responsividade em diferentes tamanhos de tela
3. Validar formatação de preços e datas
4. Garantir que o Sheet fecha corretamente em todos os cenários
5. Comparar visualmente com o design do Figma e ajustar se necessário
6. (Futuro) Implementar lógica de confirmação de reserva (salvar no banco)
