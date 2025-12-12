import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CalendarView } from "@/components/schedule/CalendarView";
import { PostModal } from "@/components/schedule/PostModal";
import { DayPostsModal } from "@/components/schedule/DayPostsModal";
import { MatrixIndicator } from "@/components/dashboard/MatrixIndicator";
import { ObjectivesViewModal } from "@/components/schedule/ObjectivesViewModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, List, Send, Target, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients } from "@/hooks/useClients";
import { usePosts, mapFunnelStage, mapDbStatusToUi, type PostWithClient } from "@/hooks/usePosts";
import { useSubmitSchedule } from "@/hooks/useApprovals";
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DiagnosticData, CalculatedMetrics } from "@/types/diagnostic";
import { formatCurrency } from "@/utils/diagnosticCalculations";

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
  rascunho: "Rascunho",
  briefing_ok: "Briefing OK",
  em_producao: "Em Produção",
  aguardando_aprovacao: "Aguardando Aprovação",
  aprovado: "Aprovado",
  agendado: "Agendado",
  publicado: "Publicado",
};

// Transform DB post to UI format
function transformPost(post: PostWithClient) {
  return {
    id: post.id,
    date: post.scheduled_date,
    time: post.scheduled_time || "10:00",
    title: post.title,
    funnel: mapFunnelStage(post.funnel_stage),
    status: mapDbStatusToUi(post.status),
    dbPost: post,
  };
}

export default function Schedule() {
  const { clients, isLoading: clientsLoading } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { posts, isLoading: postsLoading } = usePosts(selectedClientId || undefined);
  const submitSchedule = useSubmitSchedule();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDayPostsModalOpen, setIsDayPostsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDateForNewPost, setSelectedDateForNewPost] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date()); // Mês selecionado para visualização em lista
  const [isObjectivesModalOpen, setIsObjectivesModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostWithClient | null>(null);

  // Objectives state from diagnostic
  const [objectives, setObjectives] = useState(() => {
    const saved = localStorage.getItem(`diagnostic_objectives_${selectedClientId}`);
    return saved ? JSON.parse(saved) : {
      salesGoal: "0",
      leadsGoal: "0",
      maxCAC: "0",
      investment: "0",
    };
  });

  // Load objectives when client changes
  useEffect(() => {
    if (selectedClientId) {
      const saved = localStorage.getItem(`diagnostic_objectives_${selectedClientId}`);
      if (saved) {
        try {
          setObjectives(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing objectives:", error);
        }
      } else {
        // Reset to default if no saved objectives
        setObjectives({
          salesGoal: "0",
          leadsGoal: "0",
          maxCAC: "0",
          investment: "0",
        });
      }
    }
  }, [selectedClientId]);

  // Transform posts to UI format
  const transformedPosts = useMemo(() => {
    const allPosts = (posts || []).map(transformPost);
    
    // Se estiver em modo lista, filtrar apenas posts do mês selecionado
    if (viewMode === "list") {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      return allPosts.filter(post => {
        const postDate = new Date(post.date);
        return isWithinInterval(postDate, { start: monthStart, end: monthEnd });
      });
    }
    
    return allPosts;
  }, [posts, viewMode, selectedMonth]);

  const topoCount = transformedPosts.filter(p => p.funnel === "topo").length;
  const meioCount = transformedPosts.filter(p => p.funnel === "meio").length;
  const fundoCount = transformedPosts.filter(p => p.funnel === "fundo").length;

  const selectedClient = clients?.find(c => c.id === selectedClientId);
  const clientName = selectedClient?.name || "Selecione um cliente";

  const handleSubmitForApproval = async () => {
    if (!selectedClientId) {
      toast.error("Por favor, selecione um cliente primeiro.");
      return;
    }

    const total = topoCount + meioCount + fundoCount;
    
    if (total === 0) {
      toast.error("Nenhum post encontrado para este cliente.");
      return;
    }

    const topoPercent = (topoCount / total) * 100;
    const meioPercent = (meioCount / total) * 100;
    const fundoPercent = (fundoCount / total) * 100;

    // Check matrix balance
    if (Math.abs(topoPercent - 40) > 10 || Math.abs(meioPercent - 30) > 10 || Math.abs(fundoPercent - 30) > 10) {
      toast.error("A matriz 40-30-30 está desbalanceada. Ajuste os posts antes de submeter.");
      return;
    }

    if (total < 15) {
      toast.error("Você precisa de pelo menos 15 posts para submeter o cronograma.");
      return;
    }

    await submitSchedule.mutateAsync(selectedClientId);
  };


  const handleSelectPost = (post: { id: string; dbPost?: PostWithClient }) => {
    // Não faz nada - posts só podem ser visualizados, não editados diretamente
    // A edição só acontece através do modal de visualização do dia
  };

  const handleAddPost = (date?: Date) => {
    // Limpa o post selecionado e define a data para novo post
    setSelectedPost(null);
    setSelectedDateForNewPost(date || null);
    setIsPostModalOpen(true);
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDay(date);
    setIsDayPostsModalOpen(true);
  };

  const handleEditPostFromDay = (post: PostWithClient) => {
    setSelectedPost(post);
    setIsDayPostsModalOpen(false);
    setIsPostModalOpen(true);
  };

  const isLoading = clientsLoading || postsLoading;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cronograma Estratégico</h1>
            <p className="text-muted-foreground mt-1">
              Planeje e organize os posts do mês
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-48 input-modern">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {clientsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : clients && clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                )}
              </SelectContent>
            </Select>

            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "calendar" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="w-4 h-4" />
                Calendário
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
                Lista
              </Button>
            </div>

            <Button variant="outline" className="gap-2" onClick={() => setIsObjectivesModalOpen(true)}>
              <Target className="w-4 h-4" />
              Objetivos
            </Button>

            <Button 
              className="gap-2" 
              onClick={handleAddPost}
              disabled={!selectedClientId}
            >
              <Plus className="w-4 h-4" />
              Novo Post
            </Button>
          </div>
        </div>

        {/* Objective Summary */}
        <div className="glass-card p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Meta de Vendas</p>
                <p className="text-2xl font-bold">{objectives.salesGoal} vendas</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Meta de Leads</p>
                <p className="text-2xl font-bold">{objectives.leadsGoal} leads</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">CAC Máximo</p>
                <p className="text-2xl font-bold">R$ {objectives.maxCAC}</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Posts Planejados</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "-" : transformedPosts.length}
                </p>
              </div>
            </div>
            <Button 
              variant="gradient" 
              className="gap-2" 
              onClick={handleSubmitForApproval}
              disabled={!selectedClientId || isLoading || submitSchedule.isPending}
            >
              {submitSchedule.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submeter para Aprovação
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!selectedClientId ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">
                  Selecione um cliente para visualizar o cronograma
                </p>
              </div>
            ) : isLoading ? (
              <div className="glass-card p-6">
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </div>
            ) : viewMode === "calendar" ? (
              <CalendarView 
                posts={transformedPosts} 
                onAddPost={handleAddPost}
                onSelectPost={handleSelectPost}
                onSelectDay={handleSelectDay}
              />
            ) : (
              <div className="glass-card p-6">
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Posts de {format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mostrando apenas os posts deste mês
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMonth(new Date())}
                        className="h-8 w-8 text-xs"
                        title="Voltar para o mês atual"
                      >
                        Hoje
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hora</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Título</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Funil</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transformedPosts.length > 0 ? (
                        transformedPosts.map((post, index) => (
                          <tr 
                            key={post.id} 
                            className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                            onClick={() => {
                              const postDate = new Date(post.date);
                              handleSelectDay(postDate);
                            }}
                          >
                            <td className="py-3 px-4 text-sm">{index + 1}</td>
                            <td className="py-3 px-4 text-sm">{format(new Date(post.date), "dd/MM/yyyy")}</td>
                            <td className="py-3 px-4 text-sm">{post.time}</td>
                            <td className="py-3 px-4 text-sm font-medium">{post.title}</td>
                            <td className="py-3 px-4">
                              <Badge className={funnelColors[post.funnel]}>
                                {post.funnel === "topo" ? "Topo" : post.funnel === "meio" ? "Meio" : "Fundo"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {statusLabels[post.status] || post.status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            Nenhum post encontrado para este mês
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div>
            <MatrixIndicator topo={topoCount} meio={meioCount} fundo={fundoCount} />
          </div>
        </div>
      </div>

      <PostModal 
        open={isPostModalOpen} 
        onOpenChange={(open) => {
          setIsPostModalOpen(open);
          if (!open) {
            setSelectedDateForNewPost(null);
          }
        }}
        clientId={selectedClientId}
        clientName={clientName}
        existingPost={selectedPost}
        initialDate={selectedDateForNewPost}
      />
      
      <DayPostsModal
        open={isDayPostsModalOpen}
        onOpenChange={setIsDayPostsModalOpen}
        date={selectedDay}
        posts={posts || []}
        onEditPost={handleEditPostFromDay}
      />

      {/* Objectives View Modal */}
      <ObjectivesViewModal
        open={isObjectivesModalOpen}
        onOpenChange={setIsObjectivesModalOpen}
        clientId={selectedClientId || 'default'}
        clientName={clientName}
      />
    </MainLayout>
  );
}
