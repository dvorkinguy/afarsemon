"use client";

import React, { useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton"; // Not used in current implementation
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowRight, 
  ArrowLeft, 
  Bot, 
  Zap, 
  BarChart, 
  Users, 
  CheckCircle,
  Sparkles,
  Building,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  user: {
    name?: string;
    email?: string;
  };
  onComplete: () => void;
}

type Step = "welcome" | "industry" | "goals" | "complete";

interface UserPreferences {
  industry?: string;
  goals?: string[];
  companySize?: string;
}

interface StepTransitionState {
  isLoading: boolean;
  error?: string;
  canRetry: boolean;
}

export const OnboardingFlow = React.memo(function OnboardingFlow({ 
  user, 
  onComplete 
}: OnboardingProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [stepTransition, setStepTransition] = useState<StepTransitionState>({
    isLoading: false,
    canRetry: false
  });

  const industries = [
    { id: "retail", name: "קמעונאות ומסחר", icon: "🛍️" },
    { id: "services", name: "שירותים עסקיים", icon: "💼" },
    { id: "healthcare", name: "בריאות ורפואה", icon: "🏥" },
    { id: "education", name: "חינוך והכשרה", icon: "🎓" },
    { id: "finance", name: "פיננסים וביטוח", icon: "🏦" },
    { id: "manufacturing", name: "ייצור ותעשייה", icon: "🏭" },
    { id: "technology", name: "טכנולוגיה והיי-טק", icon: "💻" },
    { id: "other", name: "אחר", icon: "🔧" }
  ];

  const goals = [
    { id: "customer-service", name: "שיפור שירות לקוחות", icon: Bot, description: "צ'אטבוט חכם ומענה אוטומטי" },
    { id: "sales-automation", name: "אוטומציית מכירות", icon: Zap, description: "זיהוי לידים וטיפוח לקוחות" },
    { id: "analytics", name: "ניתוח נתונים", icon: BarChart, description: "דוחות חכמים ותחזיות" },
    { id: "team-management", name: "ניהול צוות", icon: Users, description: "אוטומציה של תהליכים פנימיים" }
  ];

  const companySizes = [
    { id: "solo", name: "עצמאי", description: "רק אני" },
    { id: "small", name: "עסק קטן", description: "2-10 עובדים" },
    { id: "medium", name: "עסק בינוני", description: "11-50 עובדים" },
    { id: "large", name: "עסק גדול", description: "51+ עובדים" }
  ];

  // Simulate step transitions with potential errors (for demonstration)
  const simulateStepTransition = useCallback(async (nextStep: Step) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate occasional failures for demonstration
    if (Math.random() < 0.1) { // 10% failure rate for demo
      throw new Error('שגיאה בטעינת הנתונים. אנא נסו שוב.');
    }
    
    return nextStep;
  }, []);

  // Enhanced step transition with error handling
  const handleStepTransition = useCallback(async (nextStep: Step) => {
    startTransition(async () => {
      try {
        setStepTransition({ isLoading: true, canRetry: false });
        
        await simulateStepTransition(nextStep);
        setCurrentStep(nextStep);
        
        setStepTransition({ isLoading: false, canRetry: false });
      } catch (error) {
        console.error('Step transition error:', error);
        setStepTransition({
          isLoading: false,
          error: error instanceof Error ? error.message : 'שגיאה לא צפויה',
          canRetry: true
        });
      }
    });
  }, [simulateStepTransition, startTransition]);

  // Helper to determine next step
  const getNextStep = useCallback((): Step | null => {
    switch (currentStep) {
      case "welcome": return "industry";
      case "industry": return "goals";
      case "goals": return "complete";
      case "complete": return null;
      default: return null;
    }
  }, [currentStep]);

  // Retry failed step transition
  const handleRetryTransition = useCallback(() => {
    const nextStep = getNextStep();
    if (nextStep) {
      handleStepTransition(nextStep);
    }
  }, [handleStepTransition, getNextStep]);

  const handleNext = useCallback(() => {
    // Clear any previous errors
    setStepTransition({ isLoading: false, canRetry: false });
    
    switch (currentStep) {
      case "welcome":
        handleStepTransition("industry");
        break;
      case "industry":
        handleStepTransition("goals");
        break;
      case "goals":
        handleStepTransition("complete");
        break;
      case "complete":
        // Complete onboarding without transition effect
        startTransition(() => {
          onComplete();
        });
        break;
    }
  }, [currentStep, handleStepTransition, onComplete, startTransition]);

  const handleBack = useCallback(() => {
    // Clear any previous errors
    setStepTransition({ isLoading: false, canRetry: false });
    
    // Immediate transition for going back (no loading state)
    switch (currentStep) {
      case "industry":
        setCurrentStep("welcome");
        break;
      case "goals":
        setCurrentStep("industry");
        break;
      case "complete":
        setCurrentStep("goals");
        break;
    }
  }, [currentStep]);

  const toggleGoal = (goalId: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals?.includes(goalId) 
        ? prev.goals.filter(id => id !== goalId)
        : [...(prev.goals || []), goalId]
    }));
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6 text-center" role="main" aria-labelledby="welcome-title">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-2xl" role="img" aria-label="לוגו ברוכים הבאים">
        <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      
      <div className="space-y-3">
        <h2 id="welcome-title" className="text-2xl font-bold">
          ברוכים הבאים, {user.name?.split(" ")[0] || "משתמש יקר"}! <span aria-hidden="true">🎉</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          אנחנו נרגשים שהצטרפתם לאפרסמון!<br/>
          בואו נכיר ונבנה יחד את הפתרון המושלם עבורכם.
        </p>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 space-y-2" role="complementary" aria-labelledby="process-overview">
        <h3 id="process-overview" className="font-semibold text-primary">מה אנחנו הולכים לעשות:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 text-right" role="list">
          <li role="listitem"><span aria-hidden="true">•</span> נכיר את התחום שלכם</li>
          <li role="listitem"><span aria-hidden="true">•</span> נבין את המטרות שלכם</li>
          <li role="listitem"><span aria-hidden="true">•</span> ניצור עבורכם פתרון מותאם אישית</li>
          <li role="listitem"><span aria-hidden="true">•</span> נתחיל לחסוך לכם זמן וכסף מיד!</li>
        </ul>
      </div>
    </div>
  );

  const renderIndustryStep = () => (
    <div className="space-y-6" role="main" aria-labelledby="industry-step-title">
      <div className="text-center space-y-2">
        <h2 id="industry-step-title" className="text-2xl font-bold">באיזה תחום אתם פועלים?</h2>
        <p className="text-muted-foreground" id="industry-step-description">
          זה יעזור לנו להתאים את הפתרונות לצרכים שלכם
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="industry-step-title" aria-describedby="industry-step-description">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setPreferences(prev => ({ ...prev, industry: industry.id }))}
            className={`p-4 rounded-lg border-2 transition-all text-right hover:shadow-md ${
              preferences.industry === industry.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            role="radio"
            aria-checked={preferences.industry === industry.id}
            aria-label={`בחירת תחום: ${industry.name}`}
          >
            <div className="space-y-2">
              <div className="text-2xl" aria-hidden="true">{industry.icon}</div>
              <div className="font-medium">{industry.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGoalsStep = () => (
    <div className="space-y-6" role="main" aria-labelledby="goals-step-title">
      <div className="text-center space-y-2">
        <h2 id="goals-step-title" className="text-2xl font-bold">במה אתם רוצים שנעזור?</h2>
        <p className="text-muted-foreground" id="goals-step-description">
          אתם יכולים לבחור כמה אפשרויות - נתחיל עם המשמעותי ביותר
        </p>
      </div>

      <div className="space-y-3" role="group" aria-labelledby="goals-step-title" aria-describedby="goals-step-description">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = preferences.goals?.includes(goal.id);
          
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-right hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              role="checkbox"
              aria-checked={isSelected}
              aria-describedby={`goal-${goal.id}-description`}
              aria-label={`בחירת מטרה: ${goal.name}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{goal.name}</h3>
                    {isSelected && <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />}
                  </div>
                  <p id={`goal-${goal.id}-description`} className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3" role="group" aria-labelledby="company-size-title">
        <h3 id="company-size-title" className="font-semibold">איך גודל החברה שלכם?</h3>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="company-size-title">
          {companySizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setPreferences(prev => ({ ...prev, companySize: size.id }))}
              className={`p-3 rounded-lg border text-right transition-all ${
                preferences.companySize === size.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              role="radio"
              aria-checked={preferences.companySize === size.id}
              aria-label={`בחירת גודל חברה: ${size.name} - ${size.description}`}
            >
              <div className="space-y-1">
                <div className="font-medium text-sm">{size.name}</div>
                <div className="text-xs text-muted-foreground">{size.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center" role="main" aria-labelledby="complete-title">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-2xl" role="img" aria-label="סיום מוצלח">
        <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
      </div>
      
      <div className="space-y-3">
        <h2 id="complete-title" className="text-2xl font-bold text-green-700">מעולה! אנחנו מוכנים! <span aria-hidden="true">🚀</span></h2>
        <p className="text-muted-foreground leading-relaxed">
          אנחנו מתחילים לבנות עבורכם פתרון מותאם אישית.<br/>
          צוות המומחים שלנו יצור איתכם קשר בקרוב.
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 space-y-4" role="complementary" aria-labelledby="next-steps-title">
        <h3 id="next-steps-title" className="font-semibold text-primary">מה הלאה?</h3>
        <div className="space-y-3 text-sm text-right" role="list">
          <div className="flex items-center gap-3" role="listitem">
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>נשלח לכם מייל עם המדריך להתחלה</span>
          </div>
          <div className="flex items-center gap-3" role="listitem">
            <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>מומחה מהצוות יצור איתכם קשר תוך 24 שעות</span>
          </div>
          <div className="flex items-center gap-3" role="listitem">
            <Building className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>נתחיל לבנות את הפתרון המותאם לכם</span>
          </div>
        </div>
      </div>

      <div className="space-y-2" role="region" aria-labelledby="meanwhile-actions">
        <p id="meanwhile-actions" className="text-sm font-medium">בינתיים, אתם יכולים:</p>
        <div className="flex justify-center gap-2 text-xs text-muted-foreground" role="list">
          <Badge variant="outline" role="listitem" aria-label="אפשרות: לראות דמואים">לראות דמואים</Badge>
          <Badge variant="outline" role="listitem" aria-label="אפשרות: לקרוא על הפתרונות">לקרוא על הפתרונות</Badge>
          <Badge variant="outline" role="listitem" aria-label="אפשרות: לדבר איתנו בצ'אט">לדבר איתנו בצ&apos;אט</Badge>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case "welcome": return true;
      case "industry": return !!preferences.industry;
      case "goals": return !!(preferences.goals?.length && preferences.companySize);
      case "complete": return true;
      default: return false;
    }
  };

  const getStepProgress = () => {
    const steps = ["welcome", "industry", "goals", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Loading overlay component for step transitions
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">טוען...</p>
          <p className="text-xs text-muted-foreground">מכין את השלב הבא עבורכם</p>
        </div>
      </div>
    </div>
  );

  // Error overlay component for failed transitions
  const ErrorOverlay = () => (
    stepTransition.error && (
      <div className="mb-6">
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="flex items-center justify-between">
            <span>{stepTransition.error}</span>
            {stepTransition.canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryTransition}
                className="ms-2 h-7 px-2 text-xs"
                aria-label="נסו שוב לטעון את השלב"
              >
                <RefreshCw className="h-3 w-3 me-1" aria-hidden="true" />
                נסו שוב
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-2xl shadow-xl relative" role="main" aria-labelledby="onboarding-title">
        {/* Loading overlay for step transitions */}
        {(stepTransition.isLoading || isPending) && <LoadingOverlay />}
        
        <CardHeader className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2" role="progressbar" 
               aria-valuenow={getStepProgress()} 
               aria-valuemin={0} 
               aria-valuemax={100}
               aria-label={`התקדמות בתהליך החדרה: ${Math.round(getStepProgress())}%`}>
            <div 
              className={cn(
                "bg-primary rounded-full h-2 transition-all duration-300 ease-in-out",
                (stepTransition.isLoading || isPending) && "animate-pulse"
              )}
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          
          {/* Step indicator */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className={cn(
                "px-3 py-1 transition-opacity duration-200",
                (stepTransition.isLoading || isPending) && "opacity-50"
              )}
              aria-live="polite"
            >
              שלב {currentStep === "welcome" ? "1" : currentStep === "industry" ? "2" : currentStep === "goals" ? "3" : "4"} מתוך 4
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Error display */}
          <ErrorOverlay />
          
          {/* Step content with loading state handling */}
          <div className={cn(
            "transition-opacity duration-200",
            (stepTransition.isLoading || isPending) && "opacity-30 pointer-events-none"
          )}>
            {currentStep === "welcome" && renderWelcomeStep()}
            {currentStep === "industry" && renderIndustryStep()}
            {currentStep === "goals" && renderGoalsStep()}
            {currentStep === "complete" && renderCompleteStep()}
          </div>
          
          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between pt-4 border-t" role="navigation" aria-label="ניווט בין שלבי החדרה">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === "welcome" || stepTransition.isLoading || isPending}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                (stepTransition.isLoading || isPending) && "opacity-50"
              )}
              aria-label="חזור לשלב הקודם"
              aria-describedby={stepTransition.isLoading || isPending ? "navigation-loading" : undefined}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              חזור
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || stepTransition.isLoading || isPending}
              className={cn(
                "flex items-center gap-2 relative transition-all duration-200",
                (stepTransition.isLoading || isPending) && "opacity-75"
              )}
              aria-label={
                currentStep === "complete" 
                  ? "סיום תהליך החדרה והתחלת השימוש" 
                  : "המשך לשלב הבא"
              }
              aria-describedby={stepTransition.isLoading || isPending ? "navigation-loading" : undefined}
            >
              <span className={cn(
                "transition-opacity duration-200",
                (stepTransition.isLoading || isPending) && "opacity-0"
              )}>
                {currentStep === "complete" ? "בואו נתחיל!" : "המשך"}
              </span>
              
              {/* Loading spinner for next button */}
              {(stepTransition.isLoading || isPending) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span id="navigation-loading" className="sr-only">
                    טוען את השלב הבא...
                  </span>
                </div>
              )}
              
              <ArrowRight className={cn(
                "h-4 w-4 transition-opacity duration-200",
                (stepTransition.isLoading || isPending) && "opacity-0"
              )} aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
        
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {(stepTransition.isLoading || isPending) && "טוען את השלב הבא..."}
          {stepTransition.error && `שגיאה: ${stepTransition.error}`}
        </div>
      </Card>
    </div>
  );
});