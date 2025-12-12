import { useState, useEffect } from "react";
import { DiagnosticData } from "@/types/diagnostic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Target, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step1FinancialProps {
  data: DiagnosticData;
  onUpdate: (data: DiagnosticData) => void;
}

export function Step1Financial({ data, onUpdate }: Step1FinancialProps) {
  const [faturamentoInput, setFaturamentoInput] = useState<string>('');
  const [isFaturamentoFocused, setIsFaturamentoFocused] = useState(false);
  const [vendasInput, setVendasInput] = useState<string>('');
  const [isVendasFocused, setIsVendasFocused] = useState(false);
  const [lucroInput, setLucroInput] = useState<string>('');
  const [isLucroFocused, setIsLucroFocused] = useState(false);
  const [metaFaturamentoInput, setMetaFaturamentoInput] = useState<string>('');
  const [isMetaFaturamentoFocused, setIsMetaFaturamentoFocused] = useState(false);

  const updateFinancial = (field: keyof DiagnosticData['financial'], value: number | string | boolean) => {
    onUpdate({
      ...data,
      financial: { ...data.financial, [field]: value },
    });
  };

  const parseCurrency = (value: string): number => {
    if (!value || value === '') return 0;
    // Remove tudo exceto números, vírgulas e pontos
    const cleaned = value.replace(/[^\d.,]/g, '');
    // Substitui vírgula por ponto para parseFloat
    const normalized = cleaned.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (value: number): string => {
    if (value === 0 || isNaN(value)) return '';
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Ensure financial data has all required fields
  const financial = {
    ...data.financial,
    profit: data.financial.profit || 0,
    currentMonthlyRevenue: data.financial.currentMonthlyRevenue || 0,
    monthlyGoalRevenue: data.financial.monthlyGoalRevenue || 0,
    clientOrigin: data.financial.clientOrigin || {
      referral: 0,
      paidTraffic: 0,
      organicSocial: 0,
      googleSearch: 0,
      others: 0,
    },
    clientsPerMonth: data.financial.clientsPerMonth || 0,
    canGrow: data.financial.canGrow || false,
    growthPercentage: data.financial.growthPercentage || 0,
    operationalBottleneck: data.financial.operationalBottleneck || '',
    monthlyBudget: data.financial.monthlyBudget || 0,
    previousFailedInvestment: data.financial.previousFailedInvestment || 0,
  };

  // Use currentMonthlyRevenue if set, otherwise calculate from sales and ticket
  const currentRevenue = financial.currentMonthlyRevenue > 0 
    ? financial.currentMonthlyRevenue 
    : (financial.currentMonthlySales || 0) * (financial.averageTicket || 0);
  
  // Calculate ticket médio: Faturamento ÷ Vendas
  // Always calculate from current revenue and sales, never use stored averageTicket
  const calculatedTicket = (financial.currentMonthlySales || 0) > 0 && currentRevenue > 0
    ? currentRevenue / financial.currentMonthlySales
    : 0;
  
  // Use monthlyGoalRevenue if set, otherwise calculate from goal sales and ticket
  const goalRevenue = financial.monthlyGoalRevenue > 0 
    ? financial.monthlyGoalRevenue 
    : (financial.monthlyGoal || 0) * (calculatedTicket || 0);

  // Sync faturamento input with data
  useEffect(() => {
    if (!isFaturamentoFocused) {
      setFaturamentoInput(financial.currentMonthlyRevenue > 0 ? formatCurrency(financial.currentMonthlyRevenue) : '');
    }
  }, [financial.currentMonthlyRevenue, isFaturamentoFocused]);

  // Sync lucro input with data
  useEffect(() => {
    if (!isLucroFocused) {
      setLucroInput(financial.profit > 0 ? formatCurrency(financial.profit) : '');
    }
  }, [financial.profit, isLucroFocused]);

  // Sync vendas input with data
  useEffect(() => {
    if (!isVendasFocused) {
      setVendasInput(financial.currentMonthlySales > 0 ? financial.currentMonthlySales.toString() : '');
    }
  }, [financial.currentMonthlySales, isVendasFocused]);

  // Sync meta faturamento input with data
  useEffect(() => {
    if (!isMetaFaturamentoFocused) {
      setMetaFaturamentoInput(financial.monthlyGoalRevenue > 0 ? formatCurrency(financial.monthlyGoalRevenue) : '');
    }
  }, [financial.monthlyGoalRevenue, isMetaFaturamentoFocused]);

  // Calculate profit margin from profit and revenue: Margem = (Lucro / Receita) × 100
  // Or calculate profit from margin: Lucro = Receita × (Margem / 100)
  const calculatedProfit = currentRevenue > 0 && financial.profitMargin > 0 
    ? currentRevenue * (financial.profitMargin / 100) 
    : financial.profit;
  
  const calculatedMargin = currentRevenue > 0 && financial.profit > 0
    ? (financial.profit / currentRevenue) * 100
    : financial.profitMargin;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Diagnóstico Financeiro</h2>
        <p className="text-muted-foreground">
          Entenda a matemática do negócio antes de definir objetivos de marketing.
        </p>
      </div>

      {/* Situação Atual Section */}
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Situação Atual</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Dados financeiros do negócio</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Faturamento Mensal Atual</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                <Input
                  type="text"
                  value={isFaturamentoFocused ? faturamentoInput : (financial.currentMonthlyRevenue > 0 ? formatCurrency(financial.currentMonthlyRevenue) : '')}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setFaturamentoInput(inputValue);
                    
                    // Allow empty input
                    if (inputValue === '' || inputValue === 'R$' || inputValue === 'R$ ') {
                      updateFinancial('currentMonthlyRevenue', 0);
                      updateFinancial('averageTicket', 0);
                      return;
                    }
                    
                    const revenue = parseCurrency(inputValue);
                    if (revenue >= 0) {
                      updateFinancial('currentMonthlyRevenue', revenue);
                      // Recalculate ticket from revenue and sales: Ticket Médio = Faturamento Mensal Atual ÷ Vendas por Mês (atual)
                      const sales = financial.currentMonthlySales || 0;
                      if (sales > 0 && revenue > 0) {
                        const newTicket = revenue / sales;
                        updateFinancial('averageTicket', newTicket);
                      } else if (revenue === 0 || sales === 0) {
                        updateFinancial('averageTicket', 0);
                      }
                    }
                  }}
                  onFocus={() => {
                    setIsFaturamentoFocused(true);
                    setFaturamentoInput(financial.currentMonthlyRevenue > 0 ? financial.currentMonthlyRevenue.toString().replace(/\D/g, '') : '');
                  }}
                  onBlur={(e) => {
                    setIsFaturamentoFocused(false);
                    // Format on blur if there's a value
                    const revenue = parseCurrency(e.target.value);
                    if (revenue > 0) {
                      updateFinancial('currentMonthlyRevenue', revenue);
                      setFaturamentoInput(formatCurrency(revenue));
                    } else {
                      setFaturamentoInput('');
                    }
                  }}
                  className="input-modern text-foreground bg-background pl-10"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Vendas por Mês (atual)</Label>
              <Input
                type="text"
                value={isVendasFocused ? vendasInput : (financial.currentMonthlySales > 0 ? financial.currentMonthlySales.toString() : '')}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setVendasInput(inputValue);
                  
                  // Allow empty input
                  if (inputValue === '') {
                    updateFinancial('currentMonthlySales', 0);
                    updateFinancial('averageTicket', 0);
                    return;
                  }
                  
                  // Only allow numbers
                  if (!/^\d*$/.test(inputValue)) {
                    return;
                  }
                  
                  const sales = parseFloat(inputValue) || 0;
                  updateFinancial('currentMonthlySales', sales);
                  // Recalculate ticket from revenue and sales: Ticket Médio = Faturamento Mensal Atual ÷ Vendas por Mês (atual)
                  const revenue = financial.currentMonthlyRevenue > 0 
                    ? financial.currentMonthlyRevenue 
                    : currentRevenue;
                  if (sales > 0 && revenue > 0) {
                    const newTicket = revenue / sales;
                    updateFinancial('averageTicket', newTicket);
                  } else if (sales === 0 || revenue === 0) {
                    updateFinancial('averageTicket', 0);
                  }
                }}
                onFocus={() => {
                  setIsVendasFocused(true);
                  setVendasInput(financial.currentMonthlySales > 0 ? financial.currentMonthlySales.toString() : '');
                }}
                onBlur={(e) => {
                  setIsVendasFocused(false);
                  const sales = parseFloat(e.target.value) || 0;
                  if (sales > 0) {
                    updateFinancial('currentMonthlySales', sales);
                    setVendasInput(sales.toString());
                  } else {
                    setVendasInput('');
                  }
                }}
                className="input-modern text-foreground bg-background"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Margem de Lucro</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={financial.profitMargin || ''}
                    onChange={(e) => {
                      const margin = parseFloat(e.target.value) || 0;
                      updateFinancial('profitMargin', margin);
                      // Recalculate profit from margin: Lucro = Receita × (Margem / 100)
                      if (currentRevenue > 0 && margin > 0) {
                        updateFinancial('profit', currentRevenue * (margin / 100));
                      } else if (margin === 0) {
                        updateFinancial('profit', 0);
                      }
                    }}
                    className="input-modern text-foreground bg-background pr-8"
                    placeholder="0"
                    min={0}
                    max={100}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Lucro</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input
                    type="text"
                    value={isLucroFocused ? lucroInput : (financial.profit > 0 ? formatCurrency(financial.profit) : '')}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setLucroInput(inputValue);
                      
                      if (inputValue === '' || inputValue === 'R$' || inputValue === 'R$ ') {
                        updateFinancial('profit', 0);
                        updateFinancial('profitMargin', 0);
                        return;
                      }
                      
                      const profit = parseCurrency(inputValue);
                      if (profit >= 0) {
                        updateFinancial('profit', profit);
                        // Recalculate margin from profit: Margem = (Lucro / Receita) × 100
                        if (currentRevenue > 0 && profit > 0) {
                          updateFinancial('profitMargin', (profit / currentRevenue) * 100);
                        } else if (profit === 0) {
                          updateFinancial('profitMargin', 0);
                        }
                      }
                    }}
                    onFocus={() => {
                      setIsLucroFocused(true);
                      setLucroInput(financial.profit > 0 ? financial.profit.toString().replace(/\D/g, '') : '');
                    }}
                    onBlur={(e) => {
                      setIsLucroFocused(false);
                      const profit = parseCurrency(e.target.value);
                      if (profit > 0) {
                        updateFinancial('profit', profit);
                        setLucroInput(formatCurrency(profit));
                      } else {
                        setLucroInput('');
                      }
                    }}
                    className="input-modern text-foreground bg-background pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Meta de Faturamento</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                <Input
                  type="text"
                  value={isMetaFaturamentoFocused ? metaFaturamentoInput : (financial.monthlyGoalRevenue > 0 ? formatCurrency(financial.monthlyGoalRevenue) : '')}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setMetaFaturamentoInput(inputValue);
                    
                    if (inputValue === '' || inputValue === 'R$' || inputValue === 'R$ ') {
                      updateFinancial('monthlyGoalRevenue', 0);
                      updateFinancial('monthlyGoal', 0);
                      return;
                    }
                    
                    const revenue = parseCurrency(inputValue);
                    if (revenue >= 0) {
                      updateFinancial('monthlyGoalRevenue', revenue);
                      // Recalculate goal sales from revenue and ticket: Vendas = Faturamento ÷ Ticket
                      const ticket = calculatedTicket || 1;
                      if (ticket > 0 && revenue > 0) {
                        updateFinancial('monthlyGoal', Math.round(revenue / ticket));
                      } else if (revenue === 0) {
                        updateFinancial('monthlyGoal', 0);
                      }
                    }
                  }}
                  onFocus={() => {
                    setIsMetaFaturamentoFocused(true);
                    setMetaFaturamentoInput(financial.monthlyGoalRevenue > 0 ? financial.monthlyGoalRevenue.toString().replace(/\D/g, '') : '');
                  }}
                  onBlur={(e) => {
                    setIsMetaFaturamentoFocused(false);
                    const revenue = parseCurrency(e.target.value);
                    if (revenue > 0) {
                      updateFinancial('monthlyGoalRevenue', revenue);
                      setMetaFaturamentoInput(formatCurrency(revenue));
                    } else {
                      setMetaFaturamentoInput('');
                    }
                  }}
                  className="input-modern text-foreground bg-background pl-10"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Ticket Médio</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                <Input
                  type="text"
                  value={formatCurrency(calculatedTicket)}
                  className="input-modern text-foreground bg-muted/50 pl-10"
                  placeholder="0"
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Calculado automaticamente: Faturamento Mensal Atual ÷ Vendas por Mês (atual)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacidade Operacional Section */}
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Capacidade Operacional</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Limites e gargalos da operação</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Clientes que consegue atender/mês</Label>
            <Input
              type="number"
              value={financial.clientsPerMonth || ''}
              onChange={(e) => updateFinancial('clientsPerMonth', parseFloat(e.target.value) || 0)}
              className="input-modern text-foreground bg-background"
              placeholder="0"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Tem estoque/equipe para crescer?</Label>
            <Switch
              checked={financial.canGrow}
              onCheckedChange={(checked) => {
                onUpdate({
                  ...data,
                  financial: { ...data.financial, canGrow: checked },
                });
              }}
            />
          </div>

          {financial.canGrow && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Quanto pode crescer? (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.growthPercentage || ''}
                  onChange={(e) => updateFinancial('growthPercentage', parseFloat(e.target.value) || 0)}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Qual o gargalo da operação?</Label>
            <Textarea
              value={financial.operationalBottleneck || ''}
              onChange={(e) => updateFinancial('operationalBottleneck', e.target.value)}
              className="input-modern text-foreground bg-background min-h-[80px]"
              placeholder="Ex: Falta de profissionais, espaço limitado, fornecedor lento..."
            />
          </div>
        </div>
      </div>

      {/* Origem dos Clientes Section */}
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Origem dos Clientes</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">De onde vêm seus clientes hoje? (em %)</p>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Indicação</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.clientOrigin.referral || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onUpdate({
                      ...data,
                      financial: {
                        ...data.financial,
                        clientOrigin: { ...financial.clientOrigin, referral: value },
                      },
                    });
                  }}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Tráfego Pago</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.clientOrigin.paidTraffic || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onUpdate({
                      ...data,
                      financial: {
                        ...data.financial,
                        clientOrigin: { ...financial.clientOrigin, paidTraffic: value },
                      },
                    });
                  }}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Outros</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.clientOrigin.others || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onUpdate({
                      ...data,
                      financial: {
                        ...data.financial,
                        clientOrigin: { ...financial.clientOrigin, others: value },
                      },
                    });
                  }}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Orgânico (Redes Sociais)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.clientOrigin.organicSocial || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onUpdate({
                      ...data,
                      financial: {
                        ...data.financial,
                        clientOrigin: { ...financial.clientOrigin, organicSocial: value },
                      },
                    });
                  }}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Busca Google</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={financial.clientOrigin.googleSearch || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    onUpdate({
                      ...data,
                      financial: {
                        ...data.financial,
                        clientOrigin: { ...financial.clientOrigin, googleSearch: value },
                      },
                    });
                  }}
                  className="input-modern text-foreground bg-background pr-8"
                  placeholder="0"
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Percentage Indicator */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className={cn(
              "text-sm font-semibold",
              (financial.clientOrigin.referral + 
               financial.clientOrigin.paidTraffic + 
               financial.clientOrigin.organicSocial + 
               financial.clientOrigin.googleSearch + 
               financial.clientOrigin.others) === 100 
                ? "text-success" 
                : "text-warning"
            )}>
              {financial.clientOrigin.referral + 
               financial.clientOrigin.paidTraffic + 
               financial.clientOrigin.organicSocial + 
               financial.clientOrigin.googleSearch + 
               financial.clientOrigin.others}%
            </span>
          </div>
        </div>
      </div>

      {/* Investimento em Marketing Section */}
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Investimento em Marketing</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Orçamento mensal disponível</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
              <Input
                type="text"
                value={formatCurrency(financial.monthlyBudget)}
                onChange={(e) => updateFinancial('monthlyBudget', parseCurrency(e.target.value))}
                className="input-modern text-foreground bg-background pl-10"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Investimento anterior que não deu certo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
              <Input
                type="text"
                value={formatCurrency(financial.previousFailedInvestment)}
                onChange={(e) => updateFinancial('previousFailedInvestment', parseCurrency(e.target.value))}
                className="input-modern text-foreground bg-background pl-10"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Quanto já investiu em marketing sem resultado?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
