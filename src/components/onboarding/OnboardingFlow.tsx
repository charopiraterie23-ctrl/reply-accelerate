import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Building, Target, CheckCircle } from "lucide-react";

// Temporary type annotation to avoid TypeScript errors
const supabaseAny = supabase as any;

interface OnboardingData {
  fullName: string;
  company: string;
  phone: string;
  goals: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    company: "",
    phone: "",
    goals: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Informations personnelles", icon: User },
    { id: 2, title: "Informations entreprise", icon: Building },
    { id: 3, title: "Objectifs commerciaux", icon: Target },
    { id: 4, title: "Configuration terminée", icon: CheckCircle },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabaseAny
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: data.fullName,
          company: data.company,
          phone: data.phone,
          onboarded: true,
        });

      if (error) throw error;

      toast({
        title: "Configuration terminée !",
        description: "Bienvenue dans SalesTrack Pro",
      });

      onComplete();
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                placeholder="Votre nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="Votre numéro de téléphone"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={data.company}
                onChange={(e) => setData({ ...data, company: e.target.value })}
                placeholder="Nom de votre entreprise"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">Objectifs commerciaux</Label>
              <Textarea
                id="goals"
                value={data.goals}
                onChange={(e) => setData({ ...data, goals: e.target.value })}
                placeholder="Décrivez vos objectifs commerciaux (optionnel)"
                rows={4}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="heading-md">Configuration terminée !</h3>
            <p className="text-muted-foreground">
              Vous êtes maintenant prêt à utiliser SalesTrack Pro
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg card-gradient">
        <CardHeader>
          <CardTitle className="text-center heading-lg text-gradient">
            Configuration initiale
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep} sur {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="heading-sm mb-2">{steps[currentStep - 1].title}</h3>
          </div>

          {renderStep()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            {currentStep === steps.length ? (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? "Finalisation..." : "Terminer"}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Suivant
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}