import { DiagnosticData, DEFAULT_BENCHMARKS } from "@/types/diagnostic";
import { BarChart3, ShoppingCart, Briefcase, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step2BenchmarkProps {
  data: DiagnosticData;
  onUpdate: (data: DiagnosticData) => void;
}

export function Step2Benchmark({ data, onUpdate }: Step2BenchmarkProps) {
  const setBusinessType = (type: 'B2B' | 'B2C') => {
    onUpdate({
      ...data,
      benchmark: {
        businessType: type,
        conversionRates: DEFAULT_BENCHMARKS[type],
      },
    });
  };

  const b2cMetrics = DEFAULT_BENCHMARKS.B2C;
  const b2bMetrics = DEFAULT_BENCHMARKS.B2B;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Benchmarking de Mercado</h2>
        <p className="text-muted-foreground">
          Selecione o tipo de negócio para usar taxas de conversão realistas baseadas em dados da indústria.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* B2C Card */}
        <button
          onClick={() => setBusinessType('B2C')}
          className={cn(
            "relative p-6 rounded-xl border-2 transition-all duration-200 text-left bg-background",
            data.benchmark.businessType === 'B2C' 
              ? "border-primary shadow-lg" 
              : "border-border hover:border-primary/50"
          )}
        >
          {/* Checkmark indicator */}
          <div className="absolute top-4 right-4">
            {data.benchmark.businessType === 'B2C' ? (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
            )}
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              data.benchmark.businessType === 'B2C' ? "bg-primary/10" : "bg-muted/50"
            )}>
              <ShoppingCart className={cn(
                "w-6 h-6",
                data.benchmark.businessType === 'B2C' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">B2C</h3>
              <p className="text-sm text-muted-foreground mt-1">Varejo, serviços, clínicas</p>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">
            Vende direto para consumidor final
          </p>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
              MÉTRICAS DE REFERÊNCIA
            </h4>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa alcance→clique:</span> {b2cMetrics.reachToClick}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa clique→lead:</span> {b2cMetrics.clickToLead}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa lead→venda:</span> {b2cMetrics.leadToSale}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">CAC médio:</span> R$ 200-500
              </div>
            </div>
          </div>
        </button>

        {/* B2B Card */}
        <button
          onClick={() => setBusinessType('B2B')}
          className={cn(
            "relative p-6 rounded-xl border-2 transition-all duration-200 text-left bg-background",
            data.benchmark.businessType === 'B2B' 
              ? "border-primary shadow-lg" 
              : "border-border hover:border-primary/50"
          )}
        >
          {/* Checkmark indicator */}
          <div className="absolute top-4 right-4">
            {data.benchmark.businessType === 'B2B' ? (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
            )}
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              data.benchmark.businessType === 'B2B' ? "bg-primary/10" : "bg-muted/50"
            )}>
              <Briefcase className={cn(
                "w-6 h-6",
                data.benchmark.businessType === 'B2B' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">B2B</h3>
              <p className="text-sm text-muted-foreground mt-1">Consultorias, agências, serviços premium</p>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">
            Vende para outras empresas
          </p>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
              MÉTRICAS DE REFERÊNCIA
            </h4>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa alcance→clique:</span> {b2bMetrics.reachToClick}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa clique→lead:</span> {b2bMetrics.clickToLead}%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa lead→reunião:</span> 50%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">Taxa reunião→venda:</span> 25%
              </div>
              <div className="text-muted-foreground">
                <span className="text-foreground font-medium">CAC médio:</span> R$ 800-2.500
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Como funciona o cálculo */}
      <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Como funciona o cálculo</h4>
            <p className="text-sm text-muted-foreground">
              Com base no tipo de negócio selecionado, calculamos o funil reverso: quantas pessoas você precisa alcançar, quantos cliques, leads e vendas são necessários para atingir sua meta de faturamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
