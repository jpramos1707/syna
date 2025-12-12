import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Target, DollarSign, TrendingUp, Users, MousePointerClick, Eye, CheckCircle } from "lucide-react";
import { DiagnosticData, CalculatedMetrics } from "@/types/diagnostic";
import { calculateMetrics } from "@/utils/diagnosticCalculations";
import { formatCurrency, formatNumber } from "@/utils/diagnosticCalculations";
import { MetricCard } from "@/components/diagnostic/MetricCard";
import { FunnelVisualization } from "@/components/diagnostic/FunnelVisualization";

interface ObjectivesViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

export function ObjectivesViewModal({ open, onOpenChange, clientId, clientName }: ObjectivesViewModalProps) {
  // Load diagnostic data
  const storageKey = `diagnostic_${clientId}`;
  const savedData = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
  const diagnosticData: DiagnosticData | null = savedData ? JSON.parse(savedData) : null;

  // Calculate metrics if data exists
  const metrics: CalculatedMetrics | null = diagnosticData ? calculateMetrics(diagnosticData) : null;

  if (!diagnosticData || !metrics) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Objetivos - {clientName}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum objetivo configurado
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Os objetivos deste cliente ainda não foram definidos. 
              Configure os objetivos no card do cliente para visualizar as métricas aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Objetivos - {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[80vh] pr-2 scrollbar-thin">
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-diagnostic-secondary/10 mb-4">
                <CheckCircle className="w-8 h-8 text-diagnostic-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Plano de Objetivos</h2>
              <p className="text-muted-foreground mt-2">
                Objetivos configurados para este cliente
              </p>
            </div>

            {/* Métricas principais */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                label="CAC Máximo"
                value={formatCurrency(metrics.maxCAC)}
                icon={DollarSign}
                variant="accent"
                description="Limite por cliente"
              />
              <MetricCard
                label="Vendas Necessárias"
                value={formatNumber(metrics.requiredSales)}
                icon={Target}
                variant="primary"
                description="Para atingir a meta"
              />
              <MetricCard
                label="Leads Necessários"
                value={formatNumber(metrics.requiredLeads)}
                icon={Users}
                variant="secondary"
                description="Leads qualificados"
              />
              <MetricCard
                label="Cliques Necessários"
                value={formatNumber(metrics.requiredClicks)}
                icon={MousePointerClick}
                variant="default"
              />
              <MetricCard
                label="Alcance Necessário"
                value={formatNumber(metrics.requiredReach)}
                icon={Eye}
                variant="default"
              />
              <MetricCard
                label="Investimento Viável"
                value={formatCurrency(metrics.viableInvestment)}
                icon={TrendingUp}
                variant="secondary"
                description="Orçamento sugerido"
              />
            </div>

            {/* Funil */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Funil de Conversão</h3>
              <FunnelVisualization
                reach={metrics.requiredReach}
                clicks={metrics.requiredClicks}
                leads={metrics.requiredLeads}
                sales={metrics.requiredSales}
              />
            </div>

            {/* Dados de entrada */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Dados Financeiros</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meta de Vendas:</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(diagnosticData.financial.salesGoal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meta de Leads:</span>
                    <span className="font-medium text-foreground">
                      {formatNumber(diagnosticData.financial.leadsGoal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CAC Máximo:</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(diagnosticData.financial.maxCAC)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Investimento</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investimento Mensal:</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(diagnosticData.investment.monthlyInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Conversão:</span>
                    <span className="font-medium text-foreground">
                      {diagnosticData.benchmark.conversionRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

