import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Plus, Edit, Trash2 } from "lucide-react";

// Temporary type annotation to avoid TypeScript errors
const supabaseAny = supabase as any;

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  is_default: boolean;
}

interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  is_default: boolean;
}

export function TemplateManager() {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [editingSms, setEditingSms] = useState<SmsTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const [emailResult, smsResult] = await Promise.all([
        supabaseAny.from("email_templates").select("*").order("created_at", { ascending: false }),
        supabaseAny.from("sms_templates").select("*").order("created_at", { ascending: false })
      ]);

      if (emailResult.data) setEmailTemplates(emailResult.data);
      if (smsResult.data) setSmsTemplates(smsResult.data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive",
      });
    }
  };

  const saveEmailTemplate = async (template: Partial<EmailTemplate>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const templateData = {
        ...template,
        user_id: user.id,
      };

      if (template.id) {
        const { error } = await supabaseAny
          .from("email_templates")
          .update(templateData)
          .eq("id", template.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAny
          .from("email_templates")
          .insert(templateData);
        if (error) throw error;
      }

      await fetchTemplates();
      setEditingEmail(null);
      setIsDialogOpen(false);
      toast({
        title: "Template sauvegardé",
        description: "Le template email a été sauvegardé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSmsTemplate = async (template: Partial<SmsTemplate>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const templateData = {
        ...template,
        user_id: user.id,
      };

      if (template.id) {
        const { error } = await supabaseAny
          .from("sms_templates")
          .update(templateData)
          .eq("id", template.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAny
          .from("sms_templates")
          .insert(templateData);
        if (error) throw error;
      }

      await fetchTemplates();
      setEditingSms(null);
      setIsDialogOpen(false);
      toast({
        title: "Template sauvegardé",
        description: "Le template SMS a été sauvegardé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (id: string, type: "email" | "sms") => {
    try {
      const table = type === "email" ? "email_templates" : "sms_templates";
      const { error } = await supabaseAny.from(table).delete().eq("id", id);
      if (error) throw error;

      await fetchTemplates();
      toast({
        title: "Template supprimé",
        description: "Le template a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="heading-lg text-gradient">Gestion des Templates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingEmail(null); setEditingSms(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmail || editingSms ? "Modifier le template" : "Créer un nouveau template"}
              </DialogTitle>
            </DialogHeader>
            <TemplateForm
              emailTemplate={editingEmail}
              smsTemplate={editingSms}
              onSaveEmail={saveEmailTemplate}
              onSaveSms={saveSmsTemplate}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Templates Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Templates SMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="grid gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="card-gradient">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.is_default ? "default" : "secondary"}>
                        {template.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingEmail(template);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplate(template.id, "email")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="grid gap-4">
            {smsTemplates.map((template) => (
              <Card key={template.id} className="card-gradient">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.is_default ? "default" : "secondary"}>
                        {template.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSms(template);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTemplate(template.id, "sms")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TemplateFormProps {
  emailTemplate?: EmailTemplate | null;
  smsTemplate?: SmsTemplate | null;
  onSaveEmail: (template: Partial<EmailTemplate>) => void;
  onSaveSms: (template: Partial<SmsTemplate>) => void;
  isLoading: boolean;
}

function TemplateForm({ emailTemplate, smsTemplate, onSaveEmail, onSaveSms, isLoading }: TemplateFormProps) {
  const [type, setType] = useState<"email" | "sms">(emailTemplate ? "email" : smsTemplate ? "sms" : "email");
  const [formData, setFormData] = useState({
    name: emailTemplate?.name || smsTemplate?.name || "",
    subject: emailTemplate?.subject || "",
    content: emailTemplate?.content || smsTemplate?.content || "",
    templateType: emailTemplate?.type || smsTemplate?.type || "follow_up",
  });

  const handleSave = () => {
    if (type === "email") {
      onSaveEmail({
        id: emailTemplate?.id,
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
        type: formData.templateType,
        is_default: false,
      });
    } else {
      onSaveSms({
        id: smsTemplate?.id,
        name: formData.name,
        content: formData.content,
        type: formData.templateType,
        is_default: false,
      });
    }
  };

  return (
    <div className="space-y-4">
      {!emailTemplate && !smsTemplate && (
        <Tabs value={type} onValueChange={(value: "email" | "sms") => setType(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom du template</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom du template"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="templateType">Type</Label>
        <Select value={formData.templateType} onValueChange={(value) => setFormData({ ...formData, templateType: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="follow_up">Suivi</SelectItem>
            <SelectItem value="proposal">Proposition</SelectItem>
            <SelectItem value="meeting_request">Demande RDV</SelectItem>
            <SelectItem value="thank_you">Remerciement</SelectItem>
            {type === "sms" && <SelectItem value="appointment_reminder">Rappel RDV</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {type === "email" && (
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Sujet de l'email"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={type === "email" ? "Contenu de l'email..." : "Contenu du SMS..."}
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Variables disponibles: {"{client_name}"}, {"{user_name}"}, {"{call_date}"}, {"{call_summary}"}
        </p>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "Sauvegarde..." : "Sauvegarder"}
      </Button>
    </div>
  );
}