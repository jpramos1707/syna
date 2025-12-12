import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Edit, Instagram, Facebook, Linkedin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostWithClient } from "@/hooks/usePosts";
import { mapFunnelStage, mapDbStatusToUi } from "@/hooks/usePosts";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
];

const formats = [
  { value: "carousel", label: "Carrossel" },
  { value: "reels", label: "Reels" },
  { value: "post", label: "Post Simples" },
  { value: "video", label: "Vídeo" },
  { value: "stories", label: "Stories" },
];

const funnelStages = {
  topo: "AWARENESS (Topo) - Fazer conhecer",
  meio: "CONSIDERAÇÃO (Meio) - Fazer avaliar",
  fundo: "CONVERSÃO (Fundo) - Fazer agir",
  retencao: "RETENÇÃO - Pós-venda",
};

interface DayPostsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  posts: PostWithClient[];
  onEditPost?: (post: PostWithClient) => void;
}

const funnelColors = {
  topo: "funnel-topo",
  meio: "funnel-meio",
  fundo: "funnel-fundo",
};

const statusLabels: Record<string, string> = {
  planning: "Planejamento",
  approved: "Aprovado",
  production: "Em Produção",
  published: "Publicado",
};

export function DayPostsModal({ open, onOpenChange, date, posts, onEditPost }: DayPostsModalProps) {
  if (!date) return null;

  const dateStr = format(date, "yyyy-MM-dd");
  const dayPosts = posts.filter((post) => post.scheduled_date === dateStr);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Posts do dia {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] pr-2 scrollbar-thin">
          {dayPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum post agendado para este dia</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dayPosts.map((post) => {
                const funnel = mapFunnelStage(post.funnel_stage);
                const status = mapDbStatusToUi(post.status);
                const platformIcon = platforms.find(p => p.id === post.platform?.toLowerCase());
                const formatLabel = formats.find(f => f.value === post.post_type)?.label || post.post_type;

                return (
                  <div
                    key={post.id}
                    className="glass-card p-6 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                        <Badge className={funnelColors[funnel]}>
                          {funnel === "topo" ? "Topo" : funnel === "meio" ? "Meio" : "Fundo"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {statusLabels[status] || status}
                        </Badge>
                      </div>

                      {onEditPost && (
                        <button
                          onClick={() => {
                            onEditPost(post);
                            onOpenChange(false);
                          }}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Editar post"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </button>
                      )}
                    </div>

                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                        <TabsTrigger value="basic">Básico</TabsTrigger>
                        <TabsTrigger value="briefing">Briefing</TabsTrigger>
                        <TabsTrigger value="copy">Copy</TabsTrigger>
                        <TabsTrigger value="review">Revisão</TabsTrigger>
                      </TabsList>

                      <div className="mt-4 space-y-4">
                        <TabsContent value="basic" className="space-y-4 animate-fade-in">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Data
                              </label>
                              <p className="text-sm text-foreground">
                                {format(new Date(post.scheduled_date), "dd/MM/yyyy")}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Horário
                              </label>
                              <p className="text-sm text-foreground">
                                {post.scheduled_time || "Não definido"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Plataforma</label>
                            <div className="flex items-center gap-2">
                              {platformIcon && <platformIcon.icon className="w-4 h-4" />}
                              <span className="text-sm text-foreground capitalize">
                                {post.platform || "Não definido"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Formato</label>
                            <p className="text-sm text-foreground">
                              {formatLabel || "Não definido"}
                            </p>
                          </div>

                          {/* Script for Video/Reels */}
                          {(post.post_type === "video" || post.post_type === "reels") && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">Roteiro do Vídeo</label>
                              {post.testing_hypothesis ? (
                                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                  <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {post.testing_hypothesis}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                  <p className="text-sm text-muted-foreground italic">
                                    Nenhum roteiro cadastrado
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="briefing" className="space-y-4 animate-fade-in">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">1️⃣ Objetivo Macro</label>
                            <div className="p-3 rounded-lg border border-border bg-muted/30">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full", 
                                  funnel === "topo" ? "bg-secondary" :
                                  funnel === "meio" ? "bg-warning" :
                                  funnel === "fundo" ? "bg-primary" : "bg-accent"
                                )} />
                                <span className="text-sm text-foreground">
                                  {funnelStages[funnel as keyof typeof funnelStages] || post.funnel_stage}
                                </span>
                              </div>
                            </div>
                          </div>

                          {post.target_audience_stage && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">2️⃣ Estágio do Público-Alvo</label>
                              <p className="text-sm text-foreground">{post.target_audience_stage}</p>
                            </div>
                          )}

                          {post.desired_action && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">3️⃣ Ação Desejada</label>
                              <p className="text-sm text-foreground">{post.desired_action}</p>
                            </div>
                          )}

                          {post.psychological_triggers && post.psychological_triggers.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">4️⃣ Gatilhos Psicológicos</label>
                              <div className="flex flex-wrap gap-2">
                                {post.psychological_triggers.map((trigger, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {post.main_message && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">5️⃣ Conceito/Mensagem Principal</label>
                              <p className="text-sm text-foreground">{post.main_message}</p>
                            </div>
                          )}

                          {post.cta && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">6️⃣ CTA (Call To Action)</label>
                              <p className="text-sm font-medium text-primary">{post.cta}</p>
                            </div>
                          )}

                          {(post.metric_target || post.success_metric) && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">7️⃣ Métrica de Sucesso</label>
                              <div className="flex items-center gap-2">
                                {post.metric_target && (
                                  <span className="text-sm text-foreground">
                                    Meta: {post.metric_target}
                                  </span>
                                )}
                                {post.success_metric && (
                                  <span className="text-sm text-muted-foreground">
                                    ({post.success_metric})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="copy" className="space-y-4 animate-fade-in">
                          {post.content ? (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">📝 Legenda/Copy</label>
                              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <p className="text-sm">Nenhum conteúdo cadastrado</p>
                            </div>
                          )}

                          {post.visual_references && post.visual_references.length > 0 && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">🎨 Referências Visuais</label>
                              <div className="text-sm text-muted-foreground">
                                {post.visual_references.length} referência(s) cadastrada(s)
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="review" className="space-y-4 animate-fade-in">
                          <div className="p-4 rounded-lg bg-muted/30 border border-border">
                            <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-success" />
                              Checklist de Validação
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.title ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.title && "text-muted-foreground")}>
                                  Título definido
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.scheduled_date ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.scheduled_date && "text-muted-foreground")}>
                                  Data agendada
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.funnel_stage ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.funnel_stage && "text-muted-foreground")}>
                                  Objetivo macro (funil) selecionado
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.main_message ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.main_message && "text-muted-foreground")}>
                                  Mensagem principal definida
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.cta ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.cta && "text-muted-foreground")}>
                                  CTA claro
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className={cn("w-4 h-4", post.metric_target ? "text-success" : "text-muted-foreground")} />
                                <span className={cn(!post.metric_target && "text-muted-foreground")}>
                                  Meta numérica definida
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Status do Post</label>
                            <Badge variant="outline" className="text-sm">
                              {statusLabels[status] || post.status || "Não definido"}
                            </Badge>
                          </div>

                          {post.macro_objective && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">Objetivo Macro</label>
                              <p className="text-sm text-foreground">{post.macro_objective}</p>
                            </div>
                          )}

                          {post.testing_hypothesis && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground">Hipótese de Teste</label>
                              <p className="text-sm text-foreground">{post.testing_hypothesis}</p>
                            </div>
                          )}
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

