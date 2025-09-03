"use client";

import React from "react";
import { useState, useCallback, useTransition } from "react";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  User,
  Lock,
  Sparkles,
  RefreshCw,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  email: string;
  password: string;
  name?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

interface ErrorRetryState {
  canRetry: boolean;
  retryCount: number;
  lastError?: Error;
}

type AuthMode = "signin" | "signup";

export const ModernAuthForm = React.memo(function ModernAuthForm() {
  const { data: session, isPending, error: sessionError } = useSession();
  const [isTransitionPending, startTransition] = useTransition();

  // Debug session error
  React.useEffect(() => {
    if (sessionError && process.env.NODE_ENV === 'development') {
      console.error('Session error in ModernAuthForm:', sessionError);
    }
  }, [sessionError]);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [retryState, setRetryState] = useState<ErrorRetryState>({
    canRetry: false,
    retryCount: 0
  });

  // Validation functions
  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email) return "כתובת אימייל נדרשת";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "כתובת אימייל לא תקינה";
    return undefined;
  }, []);

  const validatePassword = useCallback((password: string): string | undefined => {
    if (!password) return "סיסמה נדרשת";
    if (password.length < 6) return "הסיסמה חייבת להכיל לפחות 6 תווים";
    return undefined;
  }, []);

  const validateName = useCallback((name: string): string | undefined => {
    if (mode === "signup" && !name) return "שם מלא נדרש";
    if (name && name.length < 2) return "השם חייב להכיל לפחות 2 תווים";
    return undefined;
  }, [mode]);

  // Error categorization helper
  const categorizeError = useCallback((error: unknown): { 
    type: 'network' | 'auth' | 'validation' | 'unknown', 
    canRetry: boolean,
    message: string 
  } => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = errorMessage.toLowerCase();
    
    if (errorString.includes('network') || errorString.includes('fetch') || errorString.includes('timeout')) {
      return {
        type: 'network',
        canRetry: true,
        message: 'בעיית רשת. אנא בדקו את החיבור לאינטרנט ונסו שוב.'
      };
    }
    
    if (errorString.includes('invalid') || errorString.includes('wrong') || errorString.includes('incorrect')) {
      return {
        type: 'auth',
        canRetry: false,
        message: 'אימייל או סיסמה שגויים. אנא בדקו את הפרטים.'
      };
    }
    
    if (errorString.includes('exists') || errorString.includes('already')) {
      return {
        type: 'validation',
        canRetry: false,
        message: 'משתמש עם אימייל זה כבר קיים. נסו להתחבר או השתמשו באימייל אחר.'
      };
    }
    
    return {
      type: 'unknown',
      canRetry: true,
      message: mode === "signin" 
        ? "שגיאה בהתחברות. נסו שוב מאוחר יותר."
        : "שגיאה בהרשמה. נסו שוב מאוחר יותר."
    };
  }, [mode]);

  // Reset retry state when form data changes
  const resetRetryState = useCallback(() => {
    setRetryState({
      canRetry: false,
      retryCount: 0
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    if (mode === "signup") {
      newErrors.name = validateName(formData.name || "");
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [formData, mode, validateEmail, validatePassword, validateName]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
    
    // Reset retry state when user modifies form
    resetRetryState();
  };

  const handleGoogleSignIn = useCallback(async () => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        setErrors({});
        resetRetryState();
        
        await signIn.social({
          provider: "google",
          callbackURL: mode === "signup" ? "/onboarding" : "/dashboard",
        });
      } catch (error) {
        console.error('Google sign-in error:', error);
        
        const errorDetails = categorizeError(error);
        setErrors({ general: errorDetails.message });
        
        // Set retry state for retryable errors
        if (errorDetails.canRetry) {
          setRetryState({
            canRetry: true,
            retryCount: 0,
            lastError: error instanceof Error ? error : new Error(String(error))
          });
        }
      } finally {
        setIsLoading(false);
      }
    });
  }, [mode, categorizeError, resetRetryState, startTransition]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        setIsLoading(true);
        setErrors({});
        resetRetryState();

        if (mode === "signin") {
          await signIn.email({
            email: formData.email,
            password: formData.password,
            callbackURL: "/dashboard",
          });
          setSuccess("התחברות בוצעה בהצלחה!");
        } else {
          await signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name!,
            callbackURL: "/onboarding",
          });
          setSuccess("הרשמה בוצעה בהצלחה! ברוכים הבאים!");
        }
      } catch (error: unknown) {
        console.error('Authentication error:', error);
        
        const errorDetails = categorizeError(error);
        setErrors({ general: errorDetails.message });
        
        // Set retry state for retryable errors
        if (errorDetails.canRetry) {
          setRetryState({
            canRetry: true,
            retryCount: 0,
            lastError: error instanceof Error ? error : new Error(String(error))
          });
        }
      } finally {
        setIsLoading(false);
      }
    });
  }, [mode, formData, validateForm, categorizeError, resetRetryState, startTransition]);

  // Retry handler - defined after handleSubmit
  const handleRetry = useCallback(async () => {
    if (!retryState.canRetry || retryState.retryCount >= 3) return;
    
    setRetryState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      canRetry: false
    }));
    
    // Wait before retrying (exponential backoff)
    const delay = Math.min(1000 * Math.pow(2, retryState.retryCount), 5000);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Clear errors and retry the last action by creating a proper form event
    setErrors({});
    if (retryState.lastError) {
      const fakeEvent = {
        preventDefault: () => {},
        target: {},
        currentTarget: {}
      } as unknown as React.FormEvent;
      handleSubmit(fakeEvent);
    }
  }, [retryState, handleSubmit]);

  // Enhanced loading skeleton with better accessibility and visual hierarchy
  if (isPending) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg" dir="rtl">
        <CardHeader className="text-center space-y-4">
          {/* Logo skeleton */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/5 rounded-lg">
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-5 w-72 mx-auto" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google button skeleton */}
          <Skeleton className="h-11 w-full rounded-md" />
          
          {/* Divider skeleton */}
          <div className="relative">
            <Skeleton className="h-px w-full" />
            <div className="absolute inset-0 flex justify-center">
              <Skeleton className="h-4 w-8 bg-background" />
            </div>
          </div>
          
          {/* Form fields skeleton */}
          <div className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="relative">
                <Skeleton className="h-11 w-full" />
                <div className="absolute start-3 top-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </div>
            </div>
            
            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="relative">
                <Skeleton className="h-11 w-full" />
                <div className="absolute start-3 top-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
                <div className="absolute end-3 top-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </div>
            </div>
            
            {/* Submit button skeleton */}
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          
          {/* Mode toggle skeleton */}
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </CardContent>
        
        {/* Screen reader loading announcement */}
        <div className="sr-only" aria-live="polite" aria-label="טוען טופס התחברות">
          טוען טופס התחברות...
        </div>
      </Card>
    );
  }

  // Already signed in
  if (session) {
    return (
      <Card className="w-full max-w-md mx-auto" dir="rtl" role="main" aria-labelledby="success-title">
        <CardHeader>
          <div className="flex items-center gap-2" role="status" aria-live="polite">
            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
            <CardTitle id="success-title" className="text-green-700">מחובר בהצלחה</CardTitle>
          </div>
          <CardDescription>
            שלום {session.user?.name || session.user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" aria-label="עבור לדשבורד - עמוד הבית">
            <a href="/dashboard">עבור לדשבורד</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg" dir="rtl" role="main" aria-labelledby="auth-title" aria-describedby="auth-description">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-lg" role="img" aria-label="לוגו האפליקציה">
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle id="auth-title" className="text-2xl">
          {mode === "signin" ? "ברוכים השבים" : "הצטרפו אלינו"}
        </CardTitle>
        <CardDescription id="auth-description" className="text-base">
          {mode === "signin" 
            ? "התחברו לחשבון שלכם כדי להמשיך" 
            : "צרו חשבון חדש והתחילו לחסוך זמן עם AI"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50" role="status" aria-live="polite">
            <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Error Message with Retry */}
        {errors.general && (
          <Alert variant="destructive" className="relative" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="flex items-start gap-2">
              {retryState.canRetry ? (
                <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              )}
              <div className="flex-1 space-y-2">
                <AlertDescription className="leading-relaxed">
                  {errors.general}
                </AlertDescription>
                
                {/* Retry button for retryable errors */}
                {retryState.canRetry && retryState.retryCount < 3 && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isLoading || isTransitionPending}
                      className="h-7 px-2 text-xs bg-background hover:bg-background/80"
                      aria-label={`נסו שוב - ניסיון ${retryState.retryCount + 1} מתוך 3`}
                    >
                      <RefreshCw className={cn(
                        "h-3 w-3 me-1",
                        isLoading || isTransitionPending ? "animate-spin" : ""
                      )} aria-hidden="true" />
                      נסו שוב
                      {retryState.retryCount > 0 && (
                        <span className="text-xs text-muted-foreground" aria-label={`ניסיון ${retryState.retryCount} מתוך 3`}>
                          ({retryState.retryCount}/3)
                        </span>
                      )}
                    </Button>
                  </div>
                )}
                
                {/* Max retries reached */}
                {retryState.retryCount >= 3 && (
                  <div className="text-xs text-muted-foreground" role="status" aria-live="polite">
                    הגעתם למספר הניסיונות המרבי. אנא פנו לתמיכה אם הבעיה נמשכת.
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Enhanced Google Sign-in with loading states */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading || isTransitionPending}
          className="w-full h-11 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 relative overflow-hidden transition-all duration-200"
          variant="outline"
          aria-label={isLoading || isTransitionPending ? "מתחבר עם Google..." : "התחברות עם Google"}
          aria-describedby={isLoading || isTransitionPending ? "google-signin-loading" : undefined}
        >
          {(isLoading || isTransitionPending) ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span id="google-signin-loading" className="sr-only">מתחבר עם Google...</span>
              <span aria-hidden="true">מתחבר...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true" role="img" aria-label="לוגו Google">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>המשיכו עם Google</span>
            </div>
          )}
          
          {/* Loading overlay for better visual feedback */}
          {(isLoading || isTransitionPending) && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center" aria-hidden="true">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">או</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-labelledby="auth-title">
          {/* Name field for signup */}
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                שם מלא
                <span className="text-red-500 ms-1" aria-label="שדה חובה">*</span>
              </Label>
              <div className="relative">
                <User className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="השם המלא שלכם"
                  className={cn(
                    "ps-10 h-11 transition-all duration-200",
                    errors.name && "border-red-500 focus-visible:ring-red-500",
                    (isLoading || isTransitionPending) && "bg-muted/50 cursor-not-allowed"
                  )}
                  disabled={isLoading || isTransitionPending}
                  required
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : "name-hint"}
                />
              </div>
              {errors.name ? (
                <p id="name-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  {errors.name}
                </p>
              ) : (
                <p id="name-hint" className="sr-only">השם המלא שלכם לצורך הרשמה</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              כתובת אימייל
              <span className="text-red-500 ms-1" aria-label="שדה חובה">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                className={cn(
                  "ps-10 h-11 transition-all duration-200",
                  errors.email && "border-red-500 focus-visible:ring-red-500",
                  (isLoading || isTransitionPending) && "bg-muted/50 cursor-not-allowed"
                )}
                disabled={isLoading || isTransitionPending}
                dir="ltr"
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : "email-hint"}
                autoComplete="email"
              />
            </div>
            {errors.email ? (
              <p id="email-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.email}
              </p>
            ) : (
              <p id="email-hint" className="sr-only">כתובת האימייל שלכם לצורך התחברות</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              סיסמה
              <span className="text-red-500 ms-1" aria-label="שדה חובה">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                className={cn(
                  "ps-10 pe-10 h-11 transition-all duration-200",
                  errors.password && "border-red-500 focus-visible:ring-red-500",
                  (isLoading || isTransitionPending) && "bg-muted/50 cursor-not-allowed"
                )}
                disabled={isLoading || isTransitionPending}
                dir="ltr"
                required
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : (mode === "signup" ? "password-requirements" : "password-hint")}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute end-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isTransitionPending}
                aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.password ? (
              <p id="password-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.password}
              </p>
            ) : mode === "signup" ? (
              <p id="password-requirements" className="text-xs text-muted-foreground">
                לפחות 6 תווים
              </p>
            ) : (
              <p id="password-hint" className="sr-only">הסיסמה שלכם לצורך התחברות</p>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-11 relative overflow-hidden transition-all duration-200" 
            disabled={isLoading || isTransitionPending}
            aria-describedby={(isLoading || isTransitionPending) ? "submit-loading" : undefined}
          >
            <div className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              (isLoading || isTransitionPending) ? "opacity-0" : "opacity-100"
            )}>
              <span>{mode === "signin" ? "התחברות" : "הרשמה"}</span>
            </div>
            
            {/* Loading state overlay */}
            {(isLoading || isTransitionPending) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span id="submit-loading" className="sr-only">
                    {mode === "signin" ? "מתחבר..." : "נרשם..."}
                  </span>
                  <span aria-hidden="true">
                    {mode === "signin" ? "מתחבר..." : "נרשם..."}
                  </span>
                </div>
              </div>
            )}
            
            {/* Progress indicator */}
            {(isLoading || isTransitionPending) && (
              <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-primary/20" aria-hidden="true">
                <div className="h-full bg-primary animate-pulse"></div>
              </div>
            )}
          </Button>
        </form>

        {/* Mode Toggle */}
        <div className="text-center space-y-2" role="region" aria-label="החלפת מצב הטופס">
          <p className="text-sm text-muted-foreground" id="mode-toggle-description">
            {mode === "signin" ? "עדיין אין לכם חשבון?" : "כבר יש לכם חשבון?"}
          </p>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setErrors({});
              setSuccess("");
              resetRetryState();
            }}
            disabled={isLoading || isTransitionPending}
            className="p-0 h-auto font-medium hover:underline transition-colors duration-200"
            aria-describedby="mode-toggle-description"
            aria-label={
              mode === "signin" 
                ? "עברו למצב רישום - צרו חשבון חדש"
                : "עברו למצב התחברות - התחברו לחשבון קיים"
            }
          >
            {mode === "signin" ? "צרו חשבון חדש" : "התחברו לחשבון קיים"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});