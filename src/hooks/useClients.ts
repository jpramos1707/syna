import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "@/mocks/mockData";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];

export interface ClientWithStats extends Client {
  postsCompleted: number;
  postsTotal: number;
  goalProgress: number;
  scheduleStatus: "pending" | "approved" | "in_production" | "published";
  lastUpdate: string;
}

function formatLastUpdate(date: string): string {
  const now = new Date();
  const updated = new Date(date);
  const diffMs = now.getTime() - updated.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "há poucos minutos";
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
}

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      // Fetch clients
      const clientsData = await mockDb.clients.getAll();

      // Fetch posts for statistics
      const postsData = await mockDb.posts.getAll();

      // Calculate stats for each client
      const clientsWithStats: ClientWithStats[] = clientsData.map((client) => {
        const clientPosts = postsData.filter((p) => p.client_id === client.id);
        const postsTotal = clientPosts.length;
        const postsCompleted = clientPosts.filter(
          (p) => p.status === "publicado" || p.production_status === "concluido"
        ).length;

        // Calculate goal progress based on completed posts
        const goalProgress = postsTotal > 0 ? Math.round((postsCompleted / postsTotal) * 100) : 0;

        // Determine schedule status based on posts
        let scheduleStatus: "pending" | "approved" | "in_production" | "published" = "pending";
        const hasPublished = clientPosts.some((p) => p.status === "publicado");
        const hasApproved = clientPosts.some((p) => p.status === "aprovado");
        const hasInProduction = clientPosts.some(
          (p) => p.production_status === "em_producao" || p.production_status === "em_revisao"
        );

        if (hasPublished && postsCompleted === postsTotal && postsTotal > 0) {
          scheduleStatus = "published";
        } else if (hasInProduction) {
          scheduleStatus = "in_production";
        } else if (hasApproved) {
          scheduleStatus = "approved";
        }

        return {
          ...client,
          postsCompleted,
          postsTotal,
          goalProgress,
          scheduleStatus,
          lastUpdate: formatLastUpdate(client.updated_at),
        };
      });

      return clientsWithStats;
    },
  });

  return { clients, isLoading, error };
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (client: ClientInsert) => {
      const data = await mockDb.clients.insert(client);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      toast.error("Erro ao criar cliente. Verifique suas permissões.");
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

  return useMutation({
    mutationFn: async ({ id, ...updates }: ClientUpdate & { id: string }) => {
      const data = await mockDb.clients.update(id, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating client:", error);
      toast.error("Erro ao atualizar cliente.");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      await mockDb.clients.delete(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      toast.error("Erro ao remover cliente. Verifique suas permissões.");
    },
  });
}
