import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb, mockClients } from "@/mocks/mockData";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export type ProductionStatus = "backlog" | "briefing_aprovado" | "em_criacao" | "revisao_interna" | "aprovacao_cliente" | "agendado" | "publicado";

export interface ProductionPost extends Post {
  clientName: string;
  assigneeName?: string;
}

// Map production_status to column IDs
export const productionStatusMap: Record<string, string> = {
  "backlog": "briefing",
  "briefing_aprovado": "briefing",
  "em_criacao": "creation",
  "em_producao": "creation",
  "revisao_interna": "review",
  "em_revisao": "review",
  "aprovacao_cliente": "client_approval",
  "aguardando_aprovacao": "client_approval",
  "agendado": "scheduled",
  "aprovado": "scheduled",
  "publicado": "published",
  "concluido": "published",
};

// Reverse map - column ID to production_status
export const columnToStatusMap: Record<string, string> = {
  "briefing": "briefing_aprovado",
  "creation": "em_criacao",
  "review": "revisao_interna",
  "client_approval": "aprovacao_cliente",
  "scheduled": "agendado",
  "published": "publicado",
};

export function useProductionPosts(clientId?: string) {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["production-posts", clientId],
    queryFn: async () => {
      let postsData = await mockDb.posts.getAll(clientId && clientId !== "all" ? clientId : undefined);
      
      // Filter out draft posts
      postsData = postsData.filter((post) => post.status !== "rascunho");

      // Transform data with client names
      const transformedPosts: ProductionPost[] = postsData.map((post) => {
        const client = mockClients.find((c) => c.id === post.client_id);
        return {
          ...post,
          clientName: client?.name || "Cliente",
        };
      });

      return transformedPosts;
    },
  });

  return { posts, isLoading, error };
}

export function useUpdateProductionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, productionStatus }: { postId: string; productionStatus: string }) => {
      const data = await mockDb.posts.update(postId, { production_status: productionStatus });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-posts"] });
    },
    onError: (error) => {
      console.error("Error updating production status:", error);
      toast.error("Erro ao atualizar status de produção.");
    },
  });
}

// Fetch team members (profiles)
export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const profiles = await mockDb.profiles.getAll();
      return profiles.map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name,
      }));
    },
  });
}
