import { DiagnosticData } from "@/types/diagnostic";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { History, Instagram, Megaphone, Search, Clock } from "lucide-react";

interface Step3HistoryProps {
  data: DiagnosticData;
  onUpdate: (data: DiagnosticData) => void;
}

export function Step3History({ data, onUpdate }: Step3HistoryProps) {
  const toggleHistory = (hasHistory: boolean) => {
    onUpdate({
      ...data,
      history: { ...data.history, hasHistory },
    });
  };

  const updateSocialMedia = (field: keyof DiagnosticData['history']['socialMedia'], value: number) => {
    onUpdate({
      ...data,
      history: {
        ...data.history,
        socialMedia: { ...data.history.socialMedia, [field]: value },
      },
    });
  };

  const updatePaidTraffic = (field: keyof DiagnosticData['history']['paidTraffic'], value: number) => {
    onUpdate({
      ...data,
      history: {
        ...data.history,
        paidTraffic: { ...data.history.paidTraffic, [field]: value },
      },
    });
  };

  const updateGoogleOrganic = (field: keyof DiagnosticData['history']['googleOrganic'], value: number) => {
    onUpdate({
      ...data,
      history: {
        ...data.history,
        googleOrganic: { ...data.history.googleOrganic, [field]: value },
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Análise do Histórico</h2>
        <p className="text-muted-foreground">
          Se já teve tentativas anteriores de marketing, esses dados são ouro para otimizar a estratégia.
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
        <Switch 
          checked={data.history.hasHistory}
          onCheckedChange={toggleHistory}
          className="data-[state=checked]:bg-primary"
        />
        <Label className="text-foreground font-medium cursor-pointer">
          Já investiu em marketing digital antes?
        </Label>
      </div>

      {data.history.hasHistory && (
        <div className="space-y-6 animate-fade-in">
          {/* Redes Sociais */}
          <div className="p-6 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Redes Sociais</h3>
                <p className="text-sm text-muted-foreground">Métricas dos últimos 6 meses</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Alcance médio mensal</Label>
                <Input
                  type="text"
                  value={data.history.socialMedia.averageMonthlyReach || ''}
                  onChange={(e) => updateSocialMedia('averageMonthlyReach', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="10.000"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Taxa de engajamento</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={data.history.socialMedia.engagementRate || ''}
                    onChange={(e) => updateSocialMedia('engagementRate', Number(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0)}
                    placeholder="3.5"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Cliques em links</Label>
                <Input
                  type="text"
                  value={data.history.socialMedia.linkClicks || ''}
                  onChange={(e) => updateSocialMedia('linkClicks', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="500"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Mensagens/DMs recebidas</Label>
                <Input
                  type="text"
                  value={data.history.socialMedia.messagesReceived || ''}
                  onChange={(e) => updateSocialMedia('messagesReceived', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="150"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Leads gerados</Label>
                <Input
                  type="text"
                  value={data.history.socialMedia.leadsGenerated || ''}
                  onChange={(e) => updateSocialMedia('leadsGenerated', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="40"
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Tráfego Pago */}
          <div className="p-6 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Tráfego Pago</h3>
                <p className="text-sm text-muted-foreground">Histórico de campanhas pagas</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Investimento total</Label>
                <Input
                  type="text"
                  value={data.history.paidTraffic.totalInvestment || ''}
                  onChange={(e) => updatePaidTraffic('totalInvestment', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="5.000"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Leads gerados</Label>
                <Input
                  type="text"
                  value={data.history.paidTraffic.leadsGenerated || ''}
                  onChange={(e) => updatePaidTraffic('leadsGenerated', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="40"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Vendas geradas</Label>
                <Input
                  type="text"
                  value={data.history.paidTraffic.salesGenerated || ''}
                  onChange={(e) => updatePaidTraffic('salesGenerated', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="6"
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Google / Orgânico */}
          <div className="p-6 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Google / Orgânico</h3>
                <p className="text-sm text-muted-foreground">Tráfego do site</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Visitas no site/mês</Label>
                <Input
                  type="text"
                  value={data.history.googleOrganic.monthlyVisits || ''}
                  onChange={(e) => updateGoogleOrganic('monthlyVisits', Number(e.target.value.replace(/\D/g, '')) || 0)}
                  placeholder="1.500"
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Taxa de conversão do site</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={data.history.googleOrganic.conversionRate || ''}
                    onChange={(e) => updateGoogleOrganic('conversionRate', Number(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0)}
                    placeholder="2.5"
                    className="bg-background pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Por que isso importa? */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Por que isso importa?</h4>
                <p className="text-sm text-muted-foreground">
                  Com dados reais do seu histórico, podemos calcular o CAC real e a taxa de conversão real, ajustando as projeções para serem muito mais precisas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
