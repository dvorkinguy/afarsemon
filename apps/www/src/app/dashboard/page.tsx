"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bot, 
  Zap, 
  BarChart, 
  ArrowRight,
  Sparkles, 
  Clock,
  CheckCircle,
  Users
} from "lucide-react";
import { useDiagnostics } from "@/hooks/use-diagnostics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const { isAiReady, loading: diagnosticsLoading } = useDiagnostics();
  const router = useRouter();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  // Loading state
  if (isPending) {
    return (
      <div className="container mx-auto p-6 space-y-8" dir="rtl" role="status" aria-label="טוען דשבורד">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        
        {/* Screen reader loading announcement */}
        <div className="sr-only" aria-live="polite">
          טוען דשבורד...
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!session) {
    return null;
  }

  const firstName = session.user?.name?.split(" ")[0] || "משתמש";

  return (
    <div className="container mx-auto p-6 space-y-8" dir="rtl" role="main">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" role="banner">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>שלום {firstName}! <span aria-hidden="true">👋</span></span>
          </h1>
          <p className="text-muted-foreground text-lg">
            ברוכים השבים לדשבורד של אפרסמון. הכול מוכן לפעולה!
          </p>
        </div>
        <Button asChild className="group">
          <Link href="/onboarding" className="flex items-center gap-2" aria-label="התחל מדמו של המערכת">
            התחל מהדמה
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </Button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">סטטיסטיקות מערכת</h2>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" role="article" aria-labelledby="system-status-title">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="system-status-title" className="text-sm font-medium text-green-800">
              סטטוס המערכת
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700" role="status" aria-live="polite">פעיל</div>
            <p className="text-xs text-green-600">
              כל המערכות פועלות בצורה תקינה
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" role="article" aria-labelledby="automations-title">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="automations-title" className="text-sm font-medium text-blue-800">
              אוטומציות פעילות
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700" role="status" aria-live="polite">0</div>
            <p className="text-xs text-blue-600">
              מוכן לאוטומציה חדשה
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" role="article" aria-labelledby="time-saved-title">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle id="time-saved-title" className="text-sm font-medium text-purple-800">
              זמן שנחסך השבוע
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700" role="status" aria-live="polite">0 שעות</div>
            <p className="text-xs text-purple-600">
              מתחילים לחסוך!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="main">
        {/* AI Chat Card */}
        <Card className="group hover:shadow-lg transition-all" role="article" aria-labelledby="ai-chat-title">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg" role="img" aria-label="אייקון בינה מלאכותית">
                <Bot className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle id="ai-chat-title">צ&apos;אט עם AI</CardTitle>
                <CardDescription>
                  התחילו שיחה עם הבינה המלאכותית שלנו
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              הבינה המלאכותית שלנו מוכנה לעזור לכם עם:
            </div>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                מענה על שאלות עסקיות
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                יעוץ אוטומציה
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                ניתוח נתונים
              </li>
            </ul>
            
            {diagnosticsLoading || !isAiReady ? (
              <Button disabled className="w-full" aria-describedby="system-loading">
                <Clock className="me-2 h-4 w-4" aria-hidden="true" />
                מכין את המערכת...
                <span id="system-loading" className="sr-only">המערכת עדיין נטענת</span>
              </Button>
            ) : (
              <Button asChild className="w-full group">
                <Link href="/chat" className="flex items-center gap-2" aria-label="התחל צ'אט עם הבינה המלאכותית">
                  התחל צ&apos;אט
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Automation Hub */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>מרכז אוטומציה</CardTitle>
                <CardDescription>
                  צרו ונהלו את האוטומציות שלכם
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm mb-4">
                עדיין אין לכם אוטומציות פעילות
              </p>
              <Badge variant="outline" className="mb-4">
                בואו נתחיל!
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/automation/templates">
                  תבניות מוכנות
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/automation/create">
                  צור אוטומציה
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>ניתוח נתונים</CardTitle>
                <CardDescription>
                  תובנות והצלחות מהעסק שלכם
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">משימות הושלמו</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">₪0</div>
                <div className="text-xs text-muted-foreground">נחסך החודש</div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" asChild>
              <Link href="/analytics">
                צפו בדוח מפורט
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile & Settings */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>הפרופיל שלי</CardTitle>
                <CardDescription>
                  נהלו את החשבון וההגדרות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">שם:</span>
                <span className="text-sm text-muted-foreground">{session.user?.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">אימייל:</span>
                <span className="text-sm text-muted-foreground" dir="ltr">{session.user?.email}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  עריכת פרופיל
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">
                  הגדרות
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-primary">מוכנים לקפיצת המדרגה?</h3>
              <p className="text-muted-foreground">
                בואו נראה איך אפרסמון יכול לחסוך לכם זמן וכסף כבר היום
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/demos">
                  צפו בדמו
                </Link>
              </Button>
              <Button asChild>
                <Link href="/consultation">
                  דברו איתנו
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}