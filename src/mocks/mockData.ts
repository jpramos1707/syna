import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

// Mock Users (for auth)
export const mockUsers = [
  {
    id: "user-1",
    email: "gestor@example.com",
    password: "123456",
    role: "gestor" as const,
  },
  {
    id: "user-2",
    email: "criador@example.com",
    password: "123456",
    role: "criador" as const,
  },
  {
    id: "user-3",
    email: "designer@example.com",
    password: "123456",
    role: "designer" as const,
  },
  {
    id: "user-4",
    email: "gestor@gmail.com",
    password: "mudar123",
    role: "gestor" as const,
  },
];

// Mock Profiles
export const mockProfiles: Profile[] = [
  
  {
    id: "profile-1",
    user_id: "user-1",
    full_name: "João Gestor",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "profile-2",
    user_id: "user-2",
    full_name: "Maria Criadora",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "profile-3",
    user_id: "user-3",
    full_name: "Pedro Designer",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "profile-4",
    user_id: "user-4",
    full_name: "Gestor",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock User Roles
export const mockUserRoles: UserRole[] = [
  {
    id: "role-1",
    user_id: "user-1",
    role: "gestor",
    created_at: new Date().toISOString(),
  },
  {
    id: "role-2",
    user_id: "user-2",
    role: "criador",
    created_at: new Date().toISOString(),
  },
  {
    id: "role-3",
    user_id: "user-3",
    role: "designer",
    created_at: new Date().toISOString(),
  },
  {
    id: "role-4",
    user_id: "user-4",
    role: "gestor",
    created_at: new Date().toISOString(),
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "TechCorp",
    status: "active",
    industry: "Tecnologia",
    target_audience: "Profissionais de TI, 25-45 anos",
    brand_voice: "Inovador e confiável",
    main_platforms: ["Instagram", "LinkedIn"],
    monthly_objective: "Aumentar engajamento em 30%",
    logo_url: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-1",
  },
  {
    id: "client-2",
    name: "FashionStore",
    status: "active",
    industry: "Moda",
    target_audience: "Mulheres, 18-35 anos",
    brand_voice: "Elegante e moderno",
    main_platforms: ["Instagram", "TikTok"],
    monthly_objective: "Aumentar vendas online em 25%",
    logo_url: null,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-1",
  },
  {
    id: "client-3",
    name: "HealthPlus",
    status: "active",
    industry: "Saúde",
    target_audience: "Adultos, 30-60 anos",
    brand_voice: "Cuidadoso e profissional",
    main_platforms: ["Facebook", "Instagram"],
    monthly_objective: "Aumentar agendamentos em 40%",
    logo_url: null,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_by: "user-1",
  },
];

// Helper function to generate dates
const getDate = (daysFromNow: number, hour: number = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString().split("T")[0];
};

// Mock Posts
export const mockPosts: Post[] = [
  // TechCorp posts
  {
    id: "post-1",
    client_id: "client-1",
    title: "Lançamento do novo produto",
    content: "Estamos animados em anunciar nosso novo produto...",
    platform: "Instagram",
    funnel_stage: "topo",
    status: "aprovado",
    production_status: "em_criacao",
    scheduled_date: getDate(5),
    scheduled_time: "10:00",
    post_type: "carousel",
    main_message: "Inovação e tecnologia",
    cta: "Saiba mais",
    desired_action: "clique no link",
    macro_objective: "awareness",
    target_audience_stage: "cold",
    psychological_triggers: ["curiosidade", "autoridade"],
    visual_references: [],
    metric_target: 1000,
    success_metric: "alcance",
    testing_hypothesis: "Carrossel gera mais engajamento",
    assigned_to: "user-2",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_by: "user-2",
    reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_by: "user-1",
    review_feedback: null,
  },
  {
    id: "post-2",
    client_id: "client-1",
    title: "Dicas de produtividade",
    content: "5 dicas para aumentar sua produtividade...",
    platform: "LinkedIn",
    funnel_stage: "meio",
    status: "publicado",
    production_status: "concluido",
    scheduled_date: getDate(-2),
    scheduled_time: "14:00",
    post_type: "single",
    main_message: "Educação e valor",
    cta: "Compartilhe",
    desired_action: "comentário",
    macro_objective: "consideration",
    target_audience_stage: "warm",
    psychological_triggers: ["educação", "valor"],
    visual_references: [],
    metric_target: 500,
    success_metric: "engajamento",
    testing_hypothesis: "Conteúdo educativo gera mais interação",
    assigned_to: "user-2",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: null,
    submitted_by: null,
    reviewed_at: null,
    reviewed_by: null,
    review_feedback: null,
  },
  {
    id: "post-3",
    client_id: "client-1",
    title: "Oferta especial",
    content: "Aproveite nossa oferta exclusiva...",
    platform: "Instagram",
    funnel_stage: "fundo",
    status: "aguardando_aprovacao",
    production_status: null,
    scheduled_date: getDate(10),
    scheduled_time: "18:00",
    post_type: "single",
    main_message: "Oferta e urgência",
    cta: "Compre agora",
    desired_action: "conversão",
    macro_objective: "conversion",
    target_audience_stage: "hot",
    psychological_triggers: ["escassez", "urgência"],
    visual_references: [],
    metric_target: 200,
    success_metric: "vendas",
    testing_hypothesis: "Oferta limitada aumenta conversão",
    assigned_to: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_by: "user-2",
    reviewed_at: null,
    reviewed_by: null,
    review_feedback: null,
  },
  // FashionStore posts
  {
    id: "post-4",
    client_id: "client-2",
    title: "Nova coleção verão",
    content: "Descubra nossa nova coleção...",
    platform: "Instagram",
    funnel_stage: "topo",
    status: "aprovado",
    production_status: "revisao_interna",
    scheduled_date: getDate(7),
    scheduled_time: "12:00",
    post_type: "carousel",
    main_message: "Tendência e estilo",
    cta: "Veja a coleção",
    desired_action: "visualização",
    macro_objective: "awareness",
    target_audience_stage: "cold",
    psychological_triggers: ["aspiração", "tendência"],
    visual_references: [],
    metric_target: 2000,
    success_metric: "alcance",
    testing_hypothesis: "Carrossel de produtos aumenta interesse",
    assigned_to: "user-3",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_by: "user-2",
    reviewed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_by: "user-1",
    review_feedback: null,
  },
  {
    id: "post-5",
    client_id: "client-2",
    title: "Look do dia",
    content: "Inspiração para seu look...",
    platform: "TikTok",
    funnel_stage: "meio",
    status: "rascunho",
    production_status: null,
    scheduled_date: getDate(12),
    scheduled_time: "16:00",
    post_type: "video",
    main_message: "Inspiração e estilo",
    cta: "Salve o post",
    desired_action: "salvamento",
    macro_objective: "consideration",
    target_audience_stage: "warm",
    psychological_triggers: ["inspiração", "identificação"],
    visual_references: [],
    metric_target: 1500,
    success_metric: "salvamentos",
    testing_hypothesis: "Vídeos geram mais salvamentos",
    assigned_to: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: null,
    submitted_by: null,
    reviewed_at: null,
    reviewed_by: null,
    review_feedback: null,
  },
  // HealthPlus posts
  {
    id: "post-6",
    client_id: "client-3",
    title: "Dicas de saúde",
    content: "Cuide da sua saúde com essas dicas...",
    platform: "Facebook",
    funnel_stage: "topo",
    status: "publicado",
    production_status: "concluido",
    scheduled_date: getDate(-5),
    scheduled_time: "09:00",
    post_type: "single",
    main_message: "Cuidado e prevenção",
    cta: "Compartilhe",
    desired_action: "compartilhamento",
    macro_objective: "awareness",
    target_audience_stage: "cold",
    psychological_triggers: ["cuidado", "autoridade"],
    visual_references: [],
    metric_target: 800,
    success_metric: "alcance",
    testing_hypothesis: "Conteúdo educativo aumenta alcance",
    assigned_to: "user-2",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: null,
    submitted_by: null,
    reviewed_at: null,
    reviewed_by: null,
    review_feedback: null,
  },
  {
    id: "post-7",
    client_id: "client-3",
    title: "Agende sua consulta",
    content: "Agende sua consulta online...",
    platform: "Instagram",
    funnel_stage: "fundo",
    status: "agendado",
    production_status: "agendado",
    scheduled_date: getDate(3),
    scheduled_time: "11:00",
    post_type: "single",
    main_message: "Ação e conversão",
    cta: "Agende agora",
    desired_action: "agendamento",
    macro_objective: "conversion",
    target_audience_stage: "hot",
    psychological_triggers: ["urgência", "benefício"],
    visual_references: [],
    metric_target: 100,
    success_metric: "agendamentos",
    testing_hypothesis: "CTA direto aumenta conversão",
    assigned_to: "user-3",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "user-2",
    submitted_at: null,
    submitted_by: null,
    reviewed_at: null,
    reviewed_by: null,
    review_feedback: null,
  },
];

// In-memory storage (simulates database)
let clientsStorage: Client[] = [...mockClients];
let postsStorage: Post[] = [...mockPosts];
let profilesStorage: Profile[] = [...mockProfiles];
let userRolesStorage: UserRole[] = [...mockUserRoles];

// Helper to simulate delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock database operations
export const mockDb = {
  clients: {
    getAll: async (): Promise<Client[]> => {
      await delay();
      return [...clientsStorage].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    insert: async (client: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> => {
      await delay();
      const newClient: Client = {
        ...client,
        id: `client-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      clientsStorage.push(newClient);
      return newClient;
    },
    update: async (id: string, updates: Partial<Client>): Promise<Client> => {
      await delay();
      const index = clientsStorage.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Client not found");
      clientsStorage[index] = {
        ...clientsStorage[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return clientsStorage[index];
    },
    delete: async (id: string): Promise<void> => {
      await delay();
      clientsStorage = clientsStorage.filter((c) => c.id !== id);
    },
  },
  posts: {
    getAll: async (clientId?: string): Promise<Post[]> => {
      await delay();
      let posts = [...postsStorage];
      if (clientId) {
        posts = posts.filter((p) => p.client_id === clientId);
      }
      return posts.sort(
        (a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      );
    },
    insert: async (post: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post> => {
      await delay();
      const newPost: Post = {
        ...post,
        id: `post-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      postsStorage.push(newPost);
      return newPost;
    },
    update: async (id: string, updates: Partial<Post>): Promise<Post> => {
      await delay();
      const index = postsStorage.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Post not found");
      postsStorage[index] = {
        ...postsStorage[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return postsStorage[index];
    },
    delete: async (id: string): Promise<void> => {
      await delay();
      postsStorage = postsStorage.filter((p) => p.id !== id);
    },
    updateMany: async (
      filter: (post: Post) => boolean,
      updates: Partial<Post>
    ): Promise<void> => {
      await delay();
      postsStorage = postsStorage.map((post) =>
        filter(post) ? { ...post, ...updates, updated_at: new Date().toISOString() } : post
      );
    },
  },
  profiles: {
    getAll: async (): Promise<Profile[]> => {
      await delay();
      return [...profilesStorage];
    },
    getByUserId: async (userId: string): Promise<Profile | null> => {
      await delay();
      return profilesStorage.find((p) => p.user_id === userId) || null;
    },
  },
  userRoles: {
    getByUserId: async (userId: string): Promise<UserRole | null> => {
      await delay();
      return userRolesStorage.find((r) => r.user_id === userId) || null;
    },
  },
  // Reset to initial state (useful for testing)
  reset: () => {
    clientsStorage = [...mockClients];
    postsStorage = [...mockPosts];
    profilesStorage = [...mockProfiles];
    userRolesStorage = [...mockUserRoles];
  },
};

