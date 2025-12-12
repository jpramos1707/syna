import { DiagnosticData } from "@/types/diagnostic";
import { calculateMetrics, formatCurrency } from "@/utils/diagnosticCalculations";
import { Calendar, TrendingUp, Rocket, Check, HelpCircle, FileText } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Step5ValidationProps {
  data: DiagnosticData;
  onUpdate: (data: DiagnosticData) => void;
}

export function Step5Validation({ data, onUpdate }: Step5ValidationProps) {
  const metrics = calculateMetrics(data);
  const totalBudget = data.investment.availableBudget || 0;
  
  const updateValidation = (field: keyof DiagnosticData['validation'], value: number) => {
    onUpdate({
      ...data,
      validation: { ...data.validation, [field]: value },
    });
  };

  const month1Budget = Math.round((totalBudget * data.validation.month1Percentage) / 100);
  const month2Budget = Math.round((totalBudget * data.validation.month2Percentage) / 100);
  const month3Budget = totalBudget; // 100% sempre

  const objectives = {
    month1: [
      "Coletar dados reais do cliente",
      "Testar formatos de conteúdo",
      "Identificar melhores horários/dias",
      "Descobrir CAC real"
    ],
    month2: [
      "Dobrar verba no que converteu",
      "Cortar o que não funciona",
      "Testar variações vencedoras",
      "Refinar segmentação"
    ],
    month3: [
      "Bater meta estabelecida",
      "Manter consistência",
      "Buscar previsibilidade",
      "Escalar o que funciona"
    ]
  };

  const hypotheses = {
    month1: [
      "Qual formato gera mais leads?",
      "Qual CTA converte mais?",
      "Qual público responde melhor?"
    ],
    month2: [
      "Variação A ou B performa melhor?",
      "Público expandido mantém CAC?",
      "Conteúdo de nutrição melhora conversão?"
    ],
    month3: [
      "Meta é sustentável?",
      "CAC se mantém na escala?",
      "Capacidade operacional suporta?"
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Configure o Investimento por Fase */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Configure o Investimento por Fase
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ajuste a porcentagem do orçamento total ({formatCurrency(totalBudget)}) para cada fase
        </p>

        {/* Slider Mês 1 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-foreground">Mês 1 - Discovery</Label>
            <span className="text-sm font-bold text-warning">
              {data.validation.month1Percentage}% = {formatCurrency(month1Budget)}
            </span>
          </div>
          <Slider
            value={[data.validation.month1Percentage]}
            onValueChange={(value) => updateValidation('month1Percentage', value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Slider Mês 2 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-foreground">Mês 2 - Optimization</Label>
            <span className="text-sm font-bold text-warning">
              {data.validation.month2Percentage}% = {formatCurrency(month2Budget)}
            </span>
          </div>
          <Slider
            value={[data.validation.month2Percentage]}
            onValueChange={(value) => updateValidation('month2Percentage', value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Cards das Fases */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Mês 1: Discovery */}
        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-4 pb-4 bg-muted/30 -m-6 p-4 mb-4 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Calendar className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Mês 1: Discovery</h3>
                <p className="text-sm text-muted-foreground">Descoberta</p>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">{data.validation.month1Percentage}%</span>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Investimento</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(month1Budget)}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">OBJETIVOS</h4>
            <ul className="space-y-2">
              {objectives.month1.map((obj, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">HIPÓTESES A VALIDAR</h4>
            <ul className="space-y-2">
              {hypotheses.month1.map((hyp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <HelpCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mês 2: Optimization */}
        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-4 pb-4 bg-muted/30 -m-6 p-4 mb-4 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Mês 2: Optimization</h3>
                <p className="text-sm text-muted-foreground">Otimização</p>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">{data.validation.month2Percentage}%</span>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Investimento</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(month2Budget)}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">OBJETIVOS</h4>
            <ul className="space-y-2">
              {objectives.month2.map((obj, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">HIPÓTESES A VALIDAR</h4>
            <ul className="space-y-2">
              {hypotheses.month2.map((hyp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <HelpCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mês 3+: Scale */}
        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-4 pb-4 bg-muted/30 -m-6 p-4 mb-4 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Rocket className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Mês 3+: Scale</h3>
                <p className="text-sm text-muted-foreground">Escala</p>
              </div>
            </div>
            <span className="text-xl font-bold text-foreground">100%</span>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Investimento</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(month3Budget)}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">OBJETIVOS</h4>
            <ul className="space-y-2">
              {objectives.month3.map((obj, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">HIPÓTESES A VALIDAR</h4>
            <ul className="space-y-2">
              {hypotheses.month3.map((hyp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <HelpCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Framework MVP */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Framework MVP (Minimum Viable Plan)</h4>
            <p className="text-sm text-muted-foreground">
              Este plano progressivo permite validar hipóteses com investimento conservador, ajustar a estratégia baseado em dados reais, e escalar apenas o que funciona.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
