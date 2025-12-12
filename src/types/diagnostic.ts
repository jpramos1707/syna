export interface FinancialData {
  averageTicket: number;
  profitMargin: number;
  profit: number; // Lucro em R$
  currentMonthlyRevenue: number; // Faturamento Mensal Atual
  currentMonthlySales: number;
  monthlyGoalRevenue: number; // Meta de Faturamento
  monthlyGoal: number; // Meta de Vendas
  // Operational Capacity
  clientsPerMonth: number;
  canGrow: boolean;
  growthPercentage: number;
  operationalBottleneck: string;
  // Client Origin
  clientOrigin: {
    referral: number; // Indicação
    paidTraffic: number; // Tráfego Pago
    organicSocial: number; // Orgânico (Redes Sociais)
    googleSearch: number; // Busca Google
    others: number; // Outros
  };
  // Marketing Investment
  monthlyBudget: number;
  previousFailedInvestment: number;
}

export interface BenchmarkData {
  businessType: 'B2B' | 'B2C';
  conversionRates: {
    reachToClick: number;
    clickToLead: number;
    leadToSale: number;
  };
}

export interface HistoryData {
  hasHistory: boolean;
  // Redes Sociais
  socialMedia: {
    averageMonthlyReach: number; // Alcance médio mensal
    engagementRate: number; // Taxa de engajamento
    linkClicks: number; // Cliques em links
    messagesReceived: number; // Mensagens/DMs recebidas
    leadsGenerated: number; // Leads gerados
  };
  // Tráfego Pago
  paidTraffic: {
    totalInvestment: number; // Investimento total
    leadsGenerated: number; // Leads gerados
    salesGenerated: number; // Vendas geradas
  };
  // Google / Orgânico
  googleOrganic: {
    monthlyVisits: number; // Visitas no site/mês
    conversionRate: number; // Taxa de conversão do site
  };
  // Campos legados (mantidos para compatibilidade)
  averageLeadsPerMonth: number;
  averageConversionRate: number;
  averageCAC: number;
}

export interface InvestmentData {
  availableBudget: number;
  currentInvestment: number;
  maxAcceptableCAC: number;
}

export interface ValidationData {
  testDuration: number;
  testBudget: number;
  minimumLeads: number;
  // Porcentagens de investimento por fase
  month1Percentage: number; // Mês 1 - Discovery
  month2Percentage: number; // Mês 2 - Optimization
}

export interface DiagnosticData {
  financial: FinancialData;
  benchmark: BenchmarkData;
  history: HistoryData;
  investment: InvestmentData;
  validation: ValidationData;
}

export interface CalculatedMetrics {
  maxCAC: number;
  requiredSales: number;
  requiredLeads: number;
  requiredClicks: number;
  requiredReach: number;
  viableInvestment: number;
  viableSales?: number; // Vendas viáveis com o orçamento disponível
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
}

export const DEFAULT_BENCHMARKS = {
  B2C: {
    reachToClick: 5,
    clickToLead: 20,
    leadToSale: 20,
  },
  B2B: {
    reachToClick: 5,
    clickToLead: 32,
    leadToSale: 12.5,
  },
};

export const INITIAL_DIAGNOSTIC_DATA: DiagnosticData = {
  financial: {
    averageTicket: 0,
    profitMargin: 30,
    profit: 0,
    currentMonthlyRevenue: 0,
    currentMonthlySales: 0,
    monthlyGoalRevenue: 0,
    monthlyGoal: 0,
    clientsPerMonth: 0,
    canGrow: false,
    growthPercentage: 0,
    operationalBottleneck: "",
    clientOrigin: {
      referral: 0,
      paidTraffic: 0,
      organicSocial: 0,
      googleSearch: 0,
      others: 0,
    },
    monthlyBudget: 0,
    previousFailedInvestment: 0,
  },
  benchmark: {
    businessType: 'B2C',
    conversionRates: DEFAULT_BENCHMARKS.B2C,
  },
  history: {
    hasHistory: false,
    socialMedia: {
      averageMonthlyReach: 0,
      engagementRate: 0,
      linkClicks: 0,
      messagesReceived: 0,
      leadsGenerated: 0,
    },
    paidTraffic: {
      totalInvestment: 0,
      leadsGenerated: 0,
      salesGenerated: 0,
    },
    googleOrganic: {
      monthlyVisits: 0,
      conversionRate: 0,
    },
    averageLeadsPerMonth: 0,
    averageConversionRate: 0,
    averageCAC: 0,
  },
  investment: {
    availableBudget: 0,
    currentInvestment: 0,
    maxAcceptableCAC: 0,
  },
  validation: {
    testDuration: 30,
    testBudget: 0,
    minimumLeads: 50,
    month1Percentage: 50, // 50% para Mês 1 - Discovery
    month2Percentage: 70, // 70% para Mês 2 - Optimization
  },
};
