import { DiagnosticData } from "@/types/diagnostic";
import { calculateMetrics, formatCurrency, formatNumber } from "@/utils/diagnosticCalculations";
import { Target, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4InvestmentProps {
  data: DiagnosticData;
  onUpdate: (data: DiagnosticData) => void;
}

export function Step4Investment({ data, onUpdate }: Step4InvestmentProps) {
  const metrics = calculateMetrics(data);
  
  const updateInvestment = (field: keyof DiagnosticData['investment'], value: number) => {
    onUpdate({
      ...data,
      investment: { ...data.investment, [field]: value },
    });
  };

  // Cálculos
  const revenueDifference = data.financial.monthlyGoalRevenue - data.financial.currentMonthlyRevenue;
  const ticket = data.financial.averageTicket || 0;
  const margin = data.financial.profitMargin || 0;
  const maxCAC = ticket * (margin / 100) * 0.3;
  
  // Vendas Necessárias = Diferença de Faturamento / Ticket Médio
  const requiredSalesFromRevenue = ticket > 0 
    ? Math.ceil(revenueDifference / ticket)
    : metrics.requiredSales;
  
  // Análise de viabilidade
  const viableSales = data.investment.availableBudget > 0 && maxCAC > 0
    ? Math.floor(data.investment.availableBudget / maxCAC)
    : 0;
  const additionalRevenue = viableSales * ticket;
  const goalPercentage = revenueDifference > 0
    ? (additionalRevenue / revenueDifference) * 100
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Capacidade de Investimento vs Objetivo</h2>
        <p className="text-muted-foreground">
          Análise de viabilidade: o orçamento disponível consegue atingir a meta?
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Diferença de Faturamento */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(revenueDifference)}</p>
              <p className="text-xs text-muted-foreground mt-1">Meta - Atual</p>
            </div>
            <Target className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Diferença de Faturamento</p>
        </div>

        {/* Vendas Necessárias */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(requiredSalesFromRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">por mês</p>
            </div>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Vendas Necessárias</p>
        </div>

        {/* CAC Máximo Aceitável */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(maxCAC)}</p>
              <p className="text-xs text-muted-foreground mt-1">30% da margem</p>
            </div>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">CAC Máximo Aceitável</p>
        </div>

        {/* Investimento Necessário */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.viableInvestment)}</p>
              <p className="text-xs text-muted-foreground mt-1">para atingir meta</p>
            </div>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Investimento Necessário</p>
        </div>
      </div>

      {/* Análise de Viabilidade */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Análise de Viabilidade</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Com o orçamento de {formatCurrency(data.investment.availableBudget)}/mês
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-background border border-border">
            <p className="text-2xl font-bold text-foreground">{formatNumber(viableSales)}</p>
            <p className="text-xs text-muted-foreground mt-1">por mês</p>
            <p className="text-xs font-semibold text-foreground mt-2">Vendas viáveis</p>
          </div>
          <div className="p-4 rounded-lg bg-background border border-border">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(additionalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-1">projetado</p>
            <p className="text-xs font-semibold text-foreground mt-2">Faturamento adicional</p>
          </div>
          <div className="p-4 rounded-lg bg-background border border-border">
            <p className={cn(
              "text-2xl font-bold",
              goalPercentage === 0 ? "text-destructive" : "text-foreground"
            )}>
              {goalPercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">alcançável</p>
            <p className="text-xs font-semibold text-foreground mt-2">% da meta</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
          <p className="text-sm font-semibold text-foreground mb-2">Opções para ajustar:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Ajustar meta: Ser realista com {formatCurrency(additionalRevenue)} de faturamento adicional</li>
            <li>• Aumentar investimento: Precisa de {formatCurrency(metrics.viableInvestment)}/mês para a meta</li>
            <li>• Otimizar CAC: Reduzir custo de aquisição através de melhor segmentação e conteúdo</li>
          </ul>
        </div>
      </div>

      {/* Fórmula do CAC Máximo */}
      <div className="p-6 rounded-xl bg-muted/30 border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          FÓRMULA DO CAC MÁXIMO
        </h3>
        <div className="space-y-2 mb-4 font-mono text-sm text-foreground">
          <p>CAC máximo = Ticket × Margem × 30%</p>
          <p>CAC máximo = {formatCurrency(ticket)} × {margin}% × 30%</p>
          <p className="font-bold">CAC máximo = {formatCurrency(maxCAC)}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          30% da margem destinada a aquisição é o padrão saudável para negócios sustentáveis.
        </p>
      </div>
    </div>
  );
}
