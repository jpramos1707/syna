import { DiagnosticData, CalculatedMetrics, Recommendation } from '@/types/diagnostic';

export function calculateMetrics(data: DiagnosticData): CalculatedMetrics {
  const { financial, benchmark, history, investment } = data;
  
  // 1. CAC MÁXIMO = Ticket × Margem × 0.30 (30% da margem para aquisição)
  const maxCAC = financial.averageTicket * (financial.profitMargin / 100) * 0.3;
  
  // 2. VENDAS NECESSÁRIAS = (Meta de Faturamento - Faturamento Atual) ÷ Ticket Médio
  const revenueDifference = financial.monthlyGoalRevenue - financial.currentMonthlyRevenue;
  const requiredSales = financial.averageTicket > 0 && revenueDifference > 0
    ? Math.ceil(revenueDifference / financial.averageTicket)
    : 0;
  
  // 3. Usar taxas do histórico se disponível, senão benchmark
  // O sistema usa dados históricos (se existirem) para ajustar as taxas de conversão reais vs benchmarks
  const conversionRates = history.hasHistory && history.averageConversionRate > 0 
    ? {
        reachToClick: benchmark.conversionRates.reachToClick,
        clickToLead: benchmark.conversionRates.clickToLead,
        leadToSale: history.averageConversionRate,
      }
    : benchmark.conversionRates;
  
  // 4. FUNIL REVERSO: Vendas → Leads → Cliques → Alcance
  // Leads = Vendas ÷ Taxa Lead→Venda
  const requiredLeads = requiredSales > 0 && conversionRates.leadToSale > 0
    ? Math.ceil(requiredSales / (conversionRates.leadToSale / 100))
    : 0;
    
  // Cliques = Leads ÷ Taxa Clique→Lead
  const requiredClicks = requiredLeads > 0 && conversionRates.clickToLead > 0
    ? Math.ceil(requiredLeads / (conversionRates.clickToLead / 100))
    : 0;
    
  // Alcance = Cliques ÷ Taxa Alcance→Clique
  const requiredReach = requiredClicks > 0 && conversionRates.reachToClick > 0
    ? Math.ceil(requiredClicks / (conversionRates.reachToClick / 100))
    : 0;
  
  // 5. INVESTIMENTO VIÁVEL = Vendas Necessárias × CAC Máximo
  const viableInvestment = requiredSales * maxCAC;
  
  // 6. VENDAS VIÁVEIS = Orçamento ÷ CAC Máximo
  const viableSales = investment.availableBudget > 0 && maxCAC > 0
    ? Math.floor(investment.availableBudget / maxCAC)
    : 0;
  
  // Gerar recomendações
  const recommendations = generateRecommendations(data, {
    maxCAC,
    requiredSales,
    requiredLeads,
    requiredClicks,
    requiredReach,
    viableInvestment,
    viableSales,
  });
  
  return {
    maxCAC,
    requiredSales,
    requiredLeads,
    requiredClicks,
    requiredReach,
    viableInvestment,
    recommendations,
  };
}

function generateRecommendations(
  data: DiagnosticData, 
  metrics: Omit<CalculatedMetrics, 'recommendations'>
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { financial, history, investment } = data;
  
  // 1. Capacidade operacional < vendas necessárias → ⚠️ Alerta
  if (financial.clientsPerMonth > 0 && metrics.requiredSales > financial.clientsPerMonth) {
    recommendations.push({
      type: 'warning',
      title: 'Capacidade Operacional Limitada',
      description: `Você precisa de ${metrics.requiredSales} vendas/mês, mas sua capacidade é de ${financial.clientsPerMonth}. Considere aumentar a equipe ou ajustar a meta.`,
    });
  }
  
  // 2. Orçamento insuficiente para meta → ⚠️ Ajuste de expectativa
  if (investment.availableBudget > 0 && metrics.requiredSales > 0) {
    const viableSales = metrics.viableSales || 0;
    const goalPercentage = financial.monthlyGoalRevenue > financial.currentMonthlyRevenue
      ? ((viableSales * financial.averageTicket) / (financial.monthlyGoalRevenue - financial.currentMonthlyRevenue)) * 100
      : 0;
    
    if (goalPercentage < 100) {
      recommendations.push({
        type: 'warning',
        title: 'Ajuste de Expectativa Necessário',
        description: `Com R$ ${investment.availableBudget.toFixed(0)} de orçamento, você consegue ~${viableSales} vendas (${goalPercentage.toFixed(0)}% da meta). Opções: aumentar investimento, otimizar CAC ou ajustar meta.`,
      });
    }
  }
  
  // 3. CAC real > CAC máximo → ⚠️ Otimizar antes de escalar
  if (history.hasHistory && history.averageCAC > 0) {
    if (history.averageCAC > metrics.maxCAC) {
      recommendations.push({
        type: 'warning',
        title: 'CAC Acima do Limite',
        description: `Seu CAC atual (R$ ${history.averageCAC.toFixed(0)}) está acima do máximo recomendado (R$ ${metrics.maxCAC.toFixed(0)}). Otimize antes de escalar.`,
      });
    }
  }
  
  // 4. Taxa conversão < benchmark → 📋 Melhorar nutrição
  if (history.hasHistory && history.averageConversionRate > 0) {
    const benchmarkRate = data.benchmark.conversionRates.leadToSale;
    if (history.averageConversionRate < benchmarkRate) {
      recommendations.push({
        type: 'info',
        title: 'Melhorar Nutrição de Leads',
        description: `Sua taxa de conversão (${history.averageConversionRate.toFixed(1)}%) está abaixo do benchmark do setor (${benchmarkRate}%). Foque em melhorar a nutrição e qualificação de leads.`,
      });
    }
  }
  
  // 5. Uma fonte > 70% clientes → ℹ️ Diversificar
  const clientOrigin = financial.clientOrigin;
  
  if (clientOrigin) {
    const totalOrigin = (clientOrigin.referral || 0) + (clientOrigin.paidTraffic || 0) + (clientOrigin.organicSocial || 0) + (clientOrigin.googleSearch || 0) + (clientOrigin.others || 0);
    
    if (totalOrigin > 0) {
      const maxOriginPercentage = Math.max(
        ((clientOrigin.referral || 0) / totalOrigin) * 100,
        ((clientOrigin.paidTraffic || 0) / totalOrigin) * 100,
        ((clientOrigin.organicSocial || 0) / totalOrigin) * 100,
        ((clientOrigin.googleSearch || 0) / totalOrigin) * 100,
        ((clientOrigin.others || 0) / totalOrigin) * 100
      );
      
      if (maxOriginPercentage > 70) {
        recommendations.push({
          type: 'info',
          title: 'Diversificar Fontes',
          description: `Mais de 70% dos clientes vêm de uma única fonte. Diversificar reduz riscos.`,
        });
      }
    }
  }
  
  return recommendations;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
}
