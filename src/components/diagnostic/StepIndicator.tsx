import { cn } from "@/lib/utils";
import { Check, Calculator, BarChart3, History, Wallet, ClipboardCheck, Target } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const stepIcons = [
  Calculator, // Financeiro
  BarChart3,  // Benchmark
  History,    // Histórico
  Wallet,     // Investimento
  ClipboardCheck, // Validação
  Target,     // Resultados
];

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = stepIcons[index] || Calculator;
        
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-diagnostic-secondary text-diagnostic-secondary-foreground",
                  isCurrent && "bg-primary text-primary-foreground shadow-lg",
                  !isCompleted && !isCurrent && "bg-muted/50 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 text-center transition-colors",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  isCompleted ? "bg-diagnostic-secondary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
