import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, Facebook, Linkedin, Twitter, Globe, Edit, Save, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface ClientDetailsData {
  accesses: {
    instagram: { username: string; password: string };
    google: { username: string; password: string };
    tiktok: { username: string; password: string };
    linkedin: { username: string; password: string };
    facebook: { username: string; password: string };
    x: { username: string; password: string };
  };
  visualIdentity: string;
  references: string;
  companyData: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    phone: string;
    cpfCnpj: string;
  };
  usefulLinks: string;
}

interface ClientDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave?: (clientId: string, data: ClientDetailsData, registrationData?: { name: string; industry: string | null; brand_voice: string | null }) => Promise<void>;
}

const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "google", name: "Conta Google", icon: Globe, color: "text-blue-500" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "text-black dark:text-white" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-700" },
  { id: "x", name: "X (Twitter)", icon: Twitter, color: "text-foreground" },
];

export function ClientDetailsModal({ open, onOpenChange, client, onSave }: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Campos do cadastro
  const [clientName, setClientName] = useState("");
  const [clientSegment, setClientSegment] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [location, setLocation] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  
  const [accesses, setAccesses] = useState({
    instagram: { username: "", password: "" },
    google: { username: "", password: "" },
    tiktok: { username: "", password: "" },
    linkedin: { username: "", password: "" },
    facebook: { username: "", password: "" },
    x: { username: "", password: "" },
  });
  
  const [visualIdentity, setVisualIdentity] = useState("");
  const [references, setReferences] = useState("");
  const [companyData, setCompanyData] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    phone: "",
    cpfCnpj: "",
  });
  const [usefulLinks, setUsefulLinks] = useState("");

  // Load client registration data
  useEffect(() => {
    if (client && open) {
      setClientName(client.name || "");
      setClientSegment(client.industry || "");
      
      // Load additional registration data from brand_voice
      try {
        const additionalData = client.brand_voice ? JSON.parse(client.brand_voice) : {};
        setResponsibleName(additionalData.responsibleName || "");
        setWitnessName(additionalData.witnessName || "");
        setLocation(additionalData.location || "");
        setPaymentDate(additionalData.paymentDate || "");
      } catch (error) {
        console.error("Error parsing brand_voice:", error);
      }
    }
  }, [client, open]);

  // Phone formatting functions
  const detectPhoneFormat = (value: string): "br" | "us" | "eu" => {
    const digits = value.replace(/\D/g, "");
    
    // Brazil: starts with country code 55 or has 10-11 digits
    if (digits.startsWith("55") || (digits.length >= 10 && digits.length <= 11)) {
      return "br";
    }
    
    // US: 10 digits (without country code) or starts with 1
    if (digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))) {
      return "us";
    }
    
    // Europe: starts with country codes 30-49 or has + prefix
    if (value.startsWith("+") || /^[3-4]\d/.test(digits)) {
      return "eu";
    }
    
    // Default based on length
    if (digits.length <= 10) return "us";
    if (digits.length <= 11) return "br";
    return "eu";
  };

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    const format = detectPhoneFormat(value);
    
    if (format === "br") {
      // Brazil: (00) 00000-0000 or (00) 0000-0000
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      }
      // 11 digits (cell phone)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    
    if (format === "us") {
      // US: (000) 000-0000
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    
    // Europe: +00 00 000 0000 or similar
    if (digits.length === 0) return "";
    if (digits.length <= 2) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setCompanyData((prev) => ({
      ...prev,
      phone: formatted,
    }));
  };

  // Parse client data when modal opens
  useEffect(() => {
    if (open && client) {
      try {
        // Try to parse additional data from brand_voice (stored as JSON)
        const additionalData = client.brand_voice ? JSON.parse(client.brand_voice) : {};
        
        // Parse client details data (stored in monthly_objective as JSON or separate fields)
        const detailsData = client.monthly_objective ? 
          (() => {
            try {
              return JSON.parse(client.monthly_objective);
            } catch {
              return {};
            }
          })() : {};

        // Handle old format (string) or new format (object with username/password)
        const parsedAccesses = detailsData.accesses || {};
        const normalizedAccesses = {
          instagram: typeof parsedAccesses.instagram === "string" 
            ? { username: parsedAccesses.instagram, password: "" }
            : (parsedAccesses.instagram || { username: "", password: "" }),
          google: typeof parsedAccesses.google === "string"
            ? { username: parsedAccesses.google, password: "" }
            : (parsedAccesses.google || { username: "", password: "" }),
          tiktok: typeof parsedAccesses.tiktok === "string"
            ? { username: parsedAccesses.tiktok, password: "" }
            : (parsedAccesses.tiktok || { username: "", password: "" }),
          linkedin: typeof parsedAccesses.linkedin === "string"
            ? { username: parsedAccesses.linkedin, password: "" }
            : (parsedAccesses.linkedin || { username: "", password: "" }),
          facebook: typeof parsedAccesses.facebook === "string"
            ? { username: parsedAccesses.facebook, password: "" }
            : (parsedAccesses.facebook || { username: "", password: "" }),
          x: typeof parsedAccesses.x === "string"
            ? { username: parsedAccesses.x, password: "" }
            : (parsedAccesses.x || { username: "", password: "" }),
        };
        setAccesses(normalizedAccesses);
        
        setVisualIdentity(detailsData.visualIdentity || "");
        setReferences(detailsData.references || "");
        
        // Handle old format (address as string) or new format (individual fields)
        const parsedCompanyData = detailsData.companyData || {};
        if (parsedCompanyData && typeof parsedCompanyData === "object" && "address" in parsedCompanyData) {
          // Old format - address is a single string
          setCompanyData({
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            phone: parsedCompanyData.phone || "",
            cpfCnpj: parsedCompanyData.cpfCnpj || "",
          });
        } else {
          // New format - individual fields
          setCompanyData({
            street: parsedCompanyData.street || "",
            number: parsedCompanyData.number || "",
            complement: parsedCompanyData.complement || "",
            neighborhood: parsedCompanyData.neighborhood || "",
            city: parsedCompanyData.city || "",
            state: parsedCompanyData.state || "",
            phone: parsedCompanyData.phone || "",
            cpfCnpj: parsedCompanyData.cpfCnpj || "",
          });
        }
        setUsefulLinks(detailsData.usefulLinks || "");
      } catch (error) {
        console.error("Error parsing client data:", error);
      }
    }
  }, [open, client]);

  const handleSave = async () => {
    if (!client || !onSave) return;

    setIsSaving(true);
    try {
      const data: ClientDetailsData = {
        accesses,
        visualIdentity,
        references,
        companyData,
        usefulLinks,
      };
      
      await onSave(client.id, data, {
        name: clientName,
        industry: clientSegment,
        brand_voice: JSON.stringify({
          responsibleName: responsibleName || null,
          witnessName: witnessName || null,
          location: location || null,
          paymentDate: paymentDate || null,
        }),
      });
      setIsEditing(false);
      toast.success("Dados salvos com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar dados");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload data from client
    if (client) {
      // Reset registration fields
      setClientName(client.name || "");
      setClientSegment(client.industry || "");
      
      try {
        const additionalData = client.brand_voice ? JSON.parse(client.brand_voice) : {};
        setResponsibleName(additionalData.responsibleName || "");
        setWitnessName(additionalData.witnessName || "");
        setLocation(additionalData.location || "");
        setPaymentDate(additionalData.paymentDate || "");
      } catch (error) {
        console.error("Error parsing brand_voice:", error);
      }
      
      try {
        const detailsData = client.monthly_objective ? 
          (() => {
            try {
              return JSON.parse(client.monthly_objective);
            } catch {
              return {};
            }
          })() : {};

        // Handle old format (string) or new format (object with username/password)
        const parsedAccesses = detailsData.accesses || {};
        const normalizedAccesses = {
          instagram: typeof parsedAccesses.instagram === "string" 
            ? { username: parsedAccesses.instagram, password: "" }
            : (parsedAccesses.instagram || { username: "", password: "" }),
          google: typeof parsedAccesses.google === "string"
            ? { username: parsedAccesses.google, password: "" }
            : (parsedAccesses.google || { username: "", password: "" }),
          tiktok: typeof parsedAccesses.tiktok === "string"
            ? { username: parsedAccesses.tiktok, password: "" }
            : (parsedAccesses.tiktok || { username: "", password: "" }),
          linkedin: typeof parsedAccesses.linkedin === "string"
            ? { username: parsedAccesses.linkedin, password: "" }
            : (parsedAccesses.linkedin || { username: "", password: "" }),
          facebook: typeof parsedAccesses.facebook === "string"
            ? { username: parsedAccesses.facebook, password: "" }
            : (parsedAccesses.facebook || { username: "", password: "" }),
          x: typeof parsedAccesses.x === "string"
            ? { username: parsedAccesses.x, password: "" }
            : (parsedAccesses.x || { username: "", password: "" }),
        };
        setAccesses(normalizedAccesses);
        
        setVisualIdentity(detailsData.visualIdentity || "");
        setReferences(detailsData.references || "");
        
        // Handle old format (address as string) or new format (individual fields)
        const parsedCompanyData = detailsData.companyData || {};
        if (parsedCompanyData && typeof parsedCompanyData === "object" && "address" in parsedCompanyData) {
          // Old format - address is a single string
          setCompanyData({
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
            phone: parsedCompanyData.phone || "",
            cpfCnpj: parsedCompanyData.cpfCnpj || "",
          });
        } else {
          // New format - individual fields
          setCompanyData({
            street: parsedCompanyData.street || "",
            number: parsedCompanyData.number || "",
            complement: parsedCompanyData.complement || "",
            neighborhood: parsedCompanyData.neighborhood || "",
            city: parsedCompanyData.city || "",
            state: parsedCompanyData.state || "",
            phone: parsedCompanyData.phone || "",
            cpfCnpj: parsedCompanyData.cpfCnpj || "",
          });
        }
        setUsefulLinks(detailsData.usefulLinks || "");
      } catch (error) {
        console.error("Error reloading data:", error);
      }
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {client.name} - Detalhes
            </DialogTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="registration" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="registration">Cadastro</TabsTrigger>
            <TabsTrigger value="accesses">Acessos</TabsTrigger>
            <TabsTrigger value="visual">Identidade</TabsTrigger>
            <TabsTrigger value="references">Referências</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="links">Links Úteis</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[60vh] mt-4 pr-2 scrollbar-thin">
            <TabsContent value="registration" className="space-y-4 animate-fade-in">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    placeholder="Nome do cliente"
                    className="input-modern"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seguimento</Label>
                  <Input
                    placeholder="Seguimento do cliente"
                    className="input-modern"
                    value={clientSegment}
                    onChange={(e) => setClientSegment(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome completo do principal responsável</Label>
                  <Input
                    placeholder="Nome do responsável"
                    className="input-modern"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome completo da testemunha do principal responsável</Label>
                  <Input
                    placeholder="Nome da testemunha"
                    className="input-modern"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Localização e área de atendimento</Label>
                  <Input
                    placeholder="Localização"
                    className="input-modern"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Melhor data para os próximos pagamentos</Label>
                  <Input
                    placeholder="Data de pagamento"
                    className="input-modern"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accesses" className="space-y-4 animate-fade-in">
              <div className="space-y-6">
                {socialPlatforms.map((platform) => (
                  <div key={platform.id} className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <platform.icon className={cn("w-4 h-4", platform.color)} />
                      {platform.name}
                    </Label>
                    <div className="space-y-2">
                      <Input
                        placeholder={`Usuário do ${platform.name}`}
                        className="input-modern"
                        value={accesses[platform.id as keyof typeof accesses].username}
                        onChange={(e) =>
                          setAccesses((prev) => ({
                            ...prev,
                            [platform.id]: {
                              ...prev[platform.id as keyof typeof prev],
                              username: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Input
                        type="password"
                        placeholder={`Senha do ${platform.name}`}
                        className="input-modern"
                        value={accesses[platform.id as keyof typeof accesses].password}
                        onChange={(e) =>
                          setAccesses((prev) => ({
                            ...prev,
                            [platform.id]: {
                              ...prev[platform.id as keyof typeof prev],
                              password: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>Link do Drive (Identidade Visual)</Label>
                <Input
                  placeholder="https://drive.google.com/..."
                  className="input-modern"
                  value={visualIdentity}
                  onChange={(e) => setVisualIdentity(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </TabsContent>

            <TabsContent value="references" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>Principais Referências (Redes Sociais Concorrentes)</Label>
                <Textarea
                  placeholder="Liste as principais referências de redes sociais de concorrentes..."
                  className="input-modern min-h-[200px]"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-4 animate-fade-in">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Rua/Avenida</Label>
                    <Input
                      placeholder="Ex: Rua das Flores"
                      className="input-modern"
                      value={companyData.street}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input
                      placeholder="Ex: 123"
                      className="input-modern"
                      value={companyData.number}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      placeholder="Ex: Sala 101"
                      className="input-modern"
                      value={companyData.complement}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          complement: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input
                      placeholder="Ex: Centro"
                      className="input-modern"
                      value={companyData.neighborhood}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          neighborhood: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      placeholder="Ex: São Paulo"
                      className="input-modern"
                      value={companyData.city}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input
                      placeholder="Ex: SP"
                      className="input-modern"
                      value={companyData.state}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    placeholder="(00) 00000-0000 (BR) | (000) 000-0000 (US) | +00 00 000 0000 (EU)"
                    className="input-modern"
                    value={companyData.phone}
                    onChange={handlePhoneChange}
                    disabled={!isEditing}
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    {companyData.phone && (
                      <>
                        Formato detectado:{" "}
                        {detectPhoneFormat(companyData.phone) === "br" && "🇧🇷 Brasil"}
                        {detectPhoneFormat(companyData.phone) === "us" && "🇺🇸 Estados Unidos"}
                        {detectPhoneFormat(companyData.phone) === "eu" && "🇪🇺 Europa"}
                      </>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>CPF/CNPJ</Label>
                  <Input
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="input-modern"
                    value={companyData.cpfCnpj}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        cpfCnpj: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label>Links Úteis (Avaliações, etc.)</Label>
                <Textarea
                  placeholder="Cole aqui links úteis, como links de avaliações, sites relacionados, etc..."
                  className="input-modern min-h-[200px]"
                  value={usefulLinks}
                  onChange={(e) => setUsefulLinks(e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Você pode colar múltiplos links, um por linha
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

