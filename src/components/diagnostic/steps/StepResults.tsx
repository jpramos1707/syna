import { DiagnosticData } from "@/types/diagnostic";
import { calculateMetrics, formatCurrency, formatNumber } from "@/utils/diagnosticCalculations";
import { 
  Target, 
  Users, 
  MousePointerClick, 
  Eye, 
  DollarSign,
  TrendingUp,
  User,
  ShoppingCart,
  AlertTriangle,
  Info,
  FileText,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepResultsProps {
  data: DiagnosticData;
}

export function StepResults({ data }: StepResultsProps) {
  const metrics = calculateMetrics(data);
  const revenueDifference = data.financial.monthlyGoalRevenue - data.financial.currentMonthlyRevenue;
  const ticket = data.financial.averageTicket || 0;
  const maxCAC = ticket * (data.financial.profitMargin / 100) * 0.3;
  const totalBudget = data.investment.availableBudget || 0;
  const month1Budget = Math.round((totalBudget * data.validation.month1Percentage) / 100);
  const month2Budget = Math.round((totalBudget * data.validation.month2Percentage) / 100);
  const month3Budget = totalBudget;
  
  // Calcular vendas necessárias baseado em faturamento
  const requiredSalesFromRevenue = ticket > 0 && revenueDifference > 0
    ? Math.ceil(revenueDifference / ticket)
    : metrics.requiredSales;

  // Taxas de conversão
  const conversionRates = data.history.hasHistory && data.history.averageConversionRate > 0 
    ? {
        reachToClick: data.benchmark.conversionRates.reachToClick,
        clickToLead: data.benchmark.conversionRates.clickToLead,
        leadToSale: data.history.averageConversionRate,
      }
    : data.benchmark.conversionRates;

  // Vendas viáveis com orçamento
  const viableSales = totalBudget > 0 && maxCAC > 0
    ? Math.floor(totalBudget / maxCAC)
    : 0;
  const goalPercentage = revenueDifference > 0
    ? ((viableSales * ticket) / revenueDifference) * 100
    : 0;

  // Verificar capacidade operacional
  const hasCapacityIssue = data.financial.clientsPerMonth > 0 && requiredSalesFromRevenue > data.financial.clientsPerMonth;
  
  // Verificar diversificação de fontes
  const clientOrigin = data.financial.clientOrigin;
  const totalOrigin = clientOrigin.referral + clientOrigin.paidTraffic + clientOrigin.organicSocial + clientOrigin.googleSearch + clientOrigin.others;
  const maxOriginPercentage = totalOrigin > 0 
    ? Math.max(
        (clientOrigin.referral / totalOrigin) * 100,
        (clientOrigin.paidTraffic / totalOrigin) * 100,
        (clientOrigin.organicSocial / totalOrigin) * 100,
        (clientOrigin.googleSearch / totalOrigin) * 100,
        (clientOrigin.others / totalOrigin) * 100
      )
    : 0;
  const needsDiversification = maxOriginPercentage > 70;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Diagnóstico Completo</h2>
          <p className="text-muted-foreground">
            Baseado nos 5 pilares, aqui está o plano estratégico com objetivos claros e mensuráveis.
          </p>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Meta de Faturamento */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(data.financial.monthlyGoalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">+{formatCurrency(revenueDifference)}</p>
            </div>
            <Eye className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Meta de Faturamento</p>
        </div>

        {/* Vendas Necessárias */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(requiredSalesFromRevenue)}/mês</p>
              <p className="text-xs text-muted-foreground mt-1">Ticket: {formatCurrency(ticket)}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Vendas Necessárias</p>
        </div>

        {/* CAC Máximo */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(maxCAC)}</p>
              <p className="text-xs text-muted-foreground mt-1">30% da margem</p>
            </div>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">CAC Máximo</p>
        </div>

        {/* Leads Necessários */}
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatNumber(metrics.requiredLeads)}/mês</p>
              <p className="text-xs text-muted-foreground mt-1">Conv: {conversionRates.leadToSale}%</p>
            </div>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-semibold text-foreground">Leads Necessários</p>
        </div>
      </div>

      {/* Funil de Aquisição e Recomendações */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Funil de Aquisição */}
        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-1">Funil de Aquisição</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Métricas necessárias para atingir {formatNumber(requiredSalesFromRevenue)} vendas/mês
          </p>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Funil de Conversão</h4>
            
            {/* Alcance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span className="font-medium text-foreground">Alcance</span>
                </div>
                <span className="font-bold text-foreground">{formatNumber(metrics.requiredReach)}</span>
              </div>
              <div className="h-10 bg-slate-700 rounded-lg flex items-center justify-end pr-3">
                <span className="text-xs font-medium text-white">{formatNumber(metrics.requiredReach)}</span>
              </div>
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground">↓</span>
              </div>
            </div>

            {/* Cliques */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-foreground">Cliques</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{formatNumber(metrics.requiredClicks)}</span>
                  <span className="text-xs text-muted-foreground">Taxa: {conversionRates.reachToClick}%</span>
                </div>
              </div>
              <div className="h-10 bg-orange-500 rounded-lg flex items-center justify-end pr-3" style={{ width: `${Math.max((metrics.requiredClicks / metrics.requiredReach) * 100, 10)}%` }}>
                <span className="text-xs font-medium text-white">{formatNumber(metrics.requiredClicks)}</span>
              </div>
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground">↓</span>
              </div>
            </div>

            {/* Leads */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-foreground">Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{formatNumber(metrics.requiredLeads)}</span>
                  <span className="text-xs text-muted-foreground">Taxa: {conversionRates.clickToLead}%</span>
                </div>
              </div>
              <div className="h-10 bg-green-600 rounded-lg flex items-center justify-end pr-3" style={{ width: `${Math.max((metrics.requiredLeads / metrics.requiredClicks) * 100, 10)}%` }}>
                <span className="text-xs font-medium text-white">{formatNumber(metrics.requiredLeads)}</span>
              </div>
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground">↓</span>
              </div>
            </div>

            {/* Vendas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-foreground">Vendas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{formatNumber(requiredSalesFromRevenue)}</span>
                  <span className="text-xs text-muted-foreground">Taxa: {conversionRates.leadToSale}%</span>
                </div>
              </div>
              <div className="h-10 bg-green-600 rounded-lg flex items-center justify-end pr-3" style={{ width: `${Math.max((requiredSalesFromRevenue / metrics.requiredLeads) * 100, 10)}%` }}>
                <span className="text-xs font-medium text-white">{formatNumber(requiredSalesFromRevenue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-1">Recomendações</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Insights estratégicos baseados nos dados informados
          </p>
          
          <div className="space-y-3">
            {/* Capacidade Operacional */}
            {hasCapacityIssue && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Você precisa de {formatNumber(requiredSalesFromRevenue)} vendas/mês, mas sua capacidade é de {formatNumber(data.financial.clientsPerMonth)}. Considere aumentar a equipe ou ajustar a meta.
                  </p>
                </div>
              </div>
            )}

            {/* Ajuste de Expectativa */}
            {totalBudget > 0 && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Com {formatCurrency(totalBudget)} de orçamento, você consegue ~{formatNumber(viableSales)} vendas ({goalPercentage.toFixed(0)}% da meta). Opções: aumentar investimento, otimizar CAC ou ajustar meta.
                  </p>
                </div>
              </div>
            )}

            {/* Diversificar Fontes */}
            {needsDiversification && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Mais de 70% dos clientes vêm de uma única fonte. Diversificar reduz riscos.
                  </p>
                </div>
              </div>
            )}

            {/* Plano de Validação */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  Mês 1: Investir {data.validation.month1Percentage}% ({formatCurrency(month1Budget)}) para descoberta. Mês 2: {data.validation.month2Percentage}% para otimização.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plano de 3 Meses */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Plano de 3 Meses</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Framework MVP para validação e escala
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Mês 1 */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="font-semibold text-foreground mb-2">Mês 1: Discovery</h4>
            <p className={cn("text-lg font-bold mb-2", "text-primary")}>
              {formatCurrency(month1Budget)}
            </p>
            <p className="text-sm text-muted-foreground">
              Investimento conservador ({data.validation.month1Percentage}%) para coletar dados reais
            </p>
          </div>

          {/* Mês 2 */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="font-semibold text-foreground mb-2">Mês 2: Otimização</h4>
            <p className={cn("text-lg font-bold mb-2", "text-primary")}>
              {formatCurrency(month2Budget)}
            </p>
            <p className="text-sm text-muted-foreground">
              Dobrar no que funciona ({data.validation.month2Percentage}%), cortar o resto
            </p>
          </div>

          {/* Mês 3+ */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <h4 className="font-semibold text-foreground mb-2">Mês 3+: Escala</h4>
            <p className={cn("text-lg font-bold mb-2", "text-primary")}>
              {formatCurrency(month3Budget)}
            </p>
            <p className="text-sm text-muted-foreground">
              100% do orçamento em estratégia validada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
