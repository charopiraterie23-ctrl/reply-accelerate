import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Phone, Calendar, Target, FileText, Send } from "lucide-react";

// Temporary type annotation to avoid TypeScript errors
const supabaseAny = supabase as any;

interface CallData {
  clientName: string;
  clientCompany: string;
  duration: number;
  date: string;
  time: string;
  outcome: string;
  summary: string;
  actionItems: string[];
}

interface CallSummaryWizardProps {
  isOpen: boolean;
  onClose: () => void;
  callData?: Partial<CallData>;
}

export function CallSummaryWizard({ isOpen, onClose, callData }: CallSummaryWizardProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CallData>({
    clientName: callData?.clientName || "",
    clientCompany: callData?.clientCompany || "",
    duration: callData?.duration || 30,
    date: callData?.date || new Date().toISOString().split('T')[0],
    time: callData?.time || new Date().toTimeString().split(' ')[0].slice(0, 5),
    outcome: callData?.outcome || "neutral",
    summary: callData?.summary || "",
    actionItems: callData?.actionItems || [""],
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const addActionItem = () => {
    setData({
      ...data,
      actionItems: [...data.actionItems, ""],
    });
  };

  const updateActionItem = (index: number, value: string) => {
    const newItems = [...data.actionItems];
    newItems[index] = value;
    setData({ ...data, actionItems: newItems });
  };

  const removeActionItem = (index: number) => {
    const newItems = data.actionItems.filter((_, i) => i !== index);
    setData({ ...data, actionItems: newItems });
  };

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      // Simulate AI summary generation
      const generatedSummary = `Appel avec ${data.clientName} de ${data.clientCompany}. 
      
Discussion sur les besoins en ${data.outcome === 'positive' ? 'solutions' : 'services'}. 
Le client a montré un intérêt ${data.outcome === 'positive' ? 'fort' : data.outcome === 'neutral' ? 'modéré' : 'limité'} pour nos propositions.

Points clés abordés:
- Présentation de notre offre
- Discussion des besoins spécifiques
- Évaluation du budget et timeline

Prochaines étapes définies selon les actions à suivre.`;
      
      setData({ ...data, summary: generatedSummary });
      toast({
        title: "Résumé généré",
        description: "Le résumé de l'appel a été généré automatiquement",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le résumé",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCall = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabaseAny.from("calls").insert({
        user_id: user.id,
        client_name: data.clientName,
        client_company: data.clientCompany,
        duration: data.duration,
        date: data.date,
        time: data.time,
        status: "completed",
        outcome: data.outcome,
        summary: data.summary,
        action_items: data.actionItems.filter(item => item.trim() !== ""),
      });

      if (error) throw error;

      toast({
        title: "Appel sauvegardé",
        description: "Le résumé d'appel a été sauvegardé avec succès",
      });

      onClose();
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-primary" />
              <h3 className="heading-sm">Informations de l'appel</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client</Label>
                <Input
                  id="clientName"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  placeholder="Nom du client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCompany">Entreprise</Label>
                <Input
                  id="clientCompany"
                  value={data.clientCompany}
                  onChange={(e) => setData({ ...data, clientCompany: e.target.value })}
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={data.time}
                  onChange={(e) => setData({ ...data, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={data.duration}
                  onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="heading-sm">Résultat de l'appel</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="outcome">Issue de l'appel</Label>
              <Select value={data.outcome} onValueChange={(value) => setData({ ...data, outcome: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positif</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                  <SelectItem value="negative">Négatif</SelectItem>
                  <SelectItem value="follow_up">À suivre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <h4 className="font-medium">Résultat sélectionné:</h4>
              <Badge variant={data.outcome === 'positive' ? 'default' : data.outcome === 'negative' ? 'destructive' : 'secondary'}>
                {data.outcome === 'positive' ? 'Positif' : 
                 data.outcome === 'negative' ? 'Négatif' : 
                 data.outcome === 'follow_up' ? 'À suivre' : 'Neutre'}
              </Badge>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="heading-sm">Résumé de l'appel</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="summary">Résumé</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSummary}
                  disabled={isLoading}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? "Génération..." : "Générer avec IA"}
                </Button>
              </div>
              <Textarea
                id="summary"
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
                placeholder="Résumé de l'appel..."
                rows={6}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="heading-sm">Actions à suivre</h3>
            </div>
            <div className="space-y-3">
              {data.actionItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateActionItem(index, e.target.value)}
                    placeholder="Action à suivre..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeActionItem(index)}
                    disabled={data.actionItems.length === 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addActionItem}
                className="w-full"
              >
                + Ajouter une action
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Assistant Résumé d'Appel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  stepNumber <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="card-gradient">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Précédent
            </Button>
            {step === 4 ? (
              <Button onClick={saveCall} disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Suivant
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}