import { ModernAuthForm } from "@/components/auth/modern-auth-form";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex flex-col" dir="rtl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 end-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 start-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 end-1/3 w-24 h-24 bg-accent/30 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6" role="banner">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10" role="img" aria-label="לוגו אפרסמון">
            <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            אפרסמון
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8" role="main">
        <div className="w-full max-w-md">
          <ModernAuthForm />
          
          {/* Benefits section */}
          <div className="mt-8 text-center space-y-2" role="complementary" aria-label="יתרונות השירות">
            <p className="text-sm text-muted-foreground">
              הצטרפו למאות עסקים ישראלים שכבר חוסכים זמן וכסף
            </p>
            <div className="flex justify-center gap-6 text-xs text-muted-foreground" role="list">
              <span role="listitem" aria-label="יתרון: אוטומציה חכמה">
                <span aria-hidden="true">✨</span> אוטומציה חכמה
              </span>
              <span role="listitem" aria-label="יתרון: הטמעה מהירה">
                <span aria-hidden="true">🚀</span> הטמעה מהירה
              </span>
              <span role="listitem" aria-label="יתרון: אבטחה מתקדמת">
                <span aria-hidden="true">🔒</span> אבטחה מתקדמת
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 px-4" role="contentinfo">
        <p className="text-xs text-muted-foreground">
          על ידי הרשמה, אתם מסכימים לתנאי השימוש ולמדיניות הפרטיות שלנו
        </p>
      </footer>
    </div>
  );
}