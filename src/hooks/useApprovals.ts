import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb, mockProfiles } from "@/mocks/mockData";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];

export interface ScheduleSubmission {
  id: string;
  clientId: string;
  clientName: string;
  month: string;
  postsCount: number;
  submittedAt: string;
  submittedBy: string;
  submittedByName: string;
  status: "pending" | "approved" | "rejected";
  matrixBalanced: boolean;
  objectiveDefined: boolean;
  feedback?: string;
  topoCount: number;
  meioCount: number;
  fundoCount: number;
}

// Get pending schedules for approval (gestors only)
export function useScheduleApprovals() {
  const { data: approvals, isLoading, error } = useQuery({
    queryKey: ["schedule-approvals"],
    queryFn: async () => {
      // Fetch all clients
      const clients = await mockDb.clients.getAll();
      const activeClients = clients.filter((c) => c.status === "active");

      // Fetch all posts with status aguardando_aprovacao or aprovado or rejected
      const allPosts = await mockDb.posts.getAll();
      const posts = allPosts.filter((p) =>
        ["aguardando_aprovacao", "aprovado", "reprovado"].includes(p.status)
      );

      // Create profile map
      const profileMap = new Map(
        mockProfiles.map((p) => [p.user_id, p.full_name || "Usuário"])
      );

      // Group posts by client and month
      const submissionMap = new Map<string, ScheduleSubmission>();

      for (const post of posts) {
        const client = activeClients.find((c) => c.id === post.client_id);
        if (!client) continue;

        const postDate = new Date(post.scheduled_date);
        const monthKey = `${client.id}-${postDate.getFullYear()}-${postDate.getMonth()}`;
        const monthLabel = postDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

        if (!submissionMap.has(monthKey)) {
          submissionMap.set(monthKey, {
            id: monthKey,
            clientId: client.id,
            clientName: client.name,
            month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
            postsCount: 0,
            submittedAt: post.submitted_at || post.updated_at,
            submittedBy: post.submitted_by || "",
            submittedByName: profileMap.get(post.submitted_by || "") || "Usuário",
            status: "pending",
            matrixBalanced: false,
            objectiveDefined: !!client.monthly_objective,
            feedback: post.review_feedback || undefined,
            topoCount: 0,
            meioCount: 0,
            fundoCount: 0,
          });
        }

        const submission = submissionMap.get(monthKey)!;
        submission.postsCount++;

        // Count funnel stages
        const funnelStage = post.funnel_stage?.toLowerCase();
        if (funnelStage === "topo" || funnelStage === "awareness") {
          submission.topoCount++;
        } else if (funnelStage === "meio" || funnelStage === "consideration") {
          submission.meioCount++;
        } else if (funnelStage === "fundo" || funnelStage === "conversion" || funnelStage === "retencao") {
          submission.fundoCount++;
        }

        // Update status based on posts
        if (post.status === "reprovado") {
          submission.status = "rejected";
          submission.feedback = post.review_feedback || undefined;
        } else if (post.status === "aprovado" && submission.status !== "rejected") {
          submission.status = "approved";
        }
      }

      // Calculate matrix balance for each submission
      for (const submission of submissionMap.values()) {
        const total = submission.topoCount + submission.meioCount + submission.fundoCount;
        if (total > 0) {
          const topoPercent = (submission.topoCount / total) * 100;
          const meioPercent = (submission.meioCount / total) * 100;
          const fundoPercent = (submission.fundoCount / total) * 100;
          submission.matrixBalanced = 
            Math.abs(topoPercent - 40) <= 15 && 
            Math.abs(meioPercent - 30) <= 15 && 
            Math.abs(fundoPercent - 30) <= 15;
        }
      }

      // Sort by submitted date
      const result = Array.from(submissionMap.values()).sort((a, b) => {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });

      return result;
    },
  });

  return { approvals, isLoading, error };
}

// Approve a schedule
export function useApproveSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, month }: { clientId: string; month: string }) => {
      // Get current user from localStorage (mock auth)
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) throw new Error("Not authenticated");
      const user = JSON.parse(storedUser);

      // Update all posts for this client with status aguardando_aprovacao
      await mockDb.posts.updateMany(
        (post) => post.client_id === clientId && post.status === "aguardando_aprovacao",
        {
          status: "aprovado",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          production_status: "em_criacao",
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Cronograma aprovado com sucesso!");
    },
    onError: (error) => {
      console.error("Error approving schedule:", error);
      toast.error("Erro ao aprovar cronograma.");
    },
  });
}

// Reject a schedule
export function useRejectSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, feedback }: { clientId: string; feedback: string }) => {
      // Get current user from localStorage (mock auth)
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) throw new Error("Not authenticated");
      const user = JSON.parse(storedUser);

      // Update all posts for this client with status aguardando_aprovacao
      await mockDb.posts.updateMany(
        (post) => post.client_id === clientId && post.status === "aguardando_aprovacao",
        {
          status: "reprovado",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          review_feedback: feedback,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.error("Cronograma reprovado.");
    },
    onError: (error) => {
      console.error("Error rejecting schedule:", error);
      toast.error("Erro ao reprovar cronograma.");
    },
  });
}

// Submit schedule for approval
export function useSubmitSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      // Get current user from localStorage (mock auth)
      const storedUser = localStorage.getItem("mock_user");
      if (!storedUser) throw new Error("Not authenticated");
      const user = JSON.parse(storedUser);

      // Update all posts for this client with status rascunho or briefing_ok
      await mockDb.posts.updateMany(
        (post) =>
          post.client_id === clientId && ["rascunho", "briefing_ok"].includes(post.status),
        {
          status: "aguardando_aprovacao",
          submitted_at: new Date().toISOString(),
          submitted_by: user.id,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Cronograma submetido para aprovação!");
    },
    onError: (error) => {
      console.error("Error submitting schedule:", error);
      toast.error("Erro ao submeter cronograma.");
    },
  });
}
