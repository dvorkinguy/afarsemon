"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Zap, 
  Brain, 
  MessageSquare,
  Settings,
  Play,
  Pause,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Workflow,
  Database,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function AIAutomationPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          פלטפורמת AI ואוטומציה
        </h1>
        <p className="text-muted-foreground text-lg">
          כלי בינה מלאכותית מתקדמים ואוטומציה חכמה לשיפור התפוקה העסקית
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              אוטומציות פעילות
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">12</div>
            <p className="text-xs text-blue-600">+2 השבוע</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              משימות שהושלמו
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">1,247</div>
            <p className="text-xs text-green-600">השבוע</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              זמן שנחסך
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">45 שעות</div>
            <p className="text-xs text-purple-600">החודש</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              דיוק AI
            </CardTitle>
            <Brain className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">94%</div>
            <p className="text-xs text-orange-600">ממוצע שבועי</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Chatbots */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>צ&apos;אטבוטים AI</CardTitle>
                <CardDescription>
                  בוטים חכמים לשירות לקוחות ותמיכה
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">בוט תמיכה כללי</span>
                </div>
                <Badge variant="secondary">פעיל</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">בוט מכירות</span>
                </div>
                <Badge variant="outline">בבדיקה</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">בוט HR</span>
                </div>
                <Badge variant="outline">לא פעיל</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                בוט חדש
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Automation */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Workflow className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>אוטומציית תהליכים</CardTitle>
                <CardDescription>
                  זרימות עבודה אוטומטיות חכמות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">עיבוד הזמנות</span>
                </div>
                <span className="text-xs text-muted-foreground">89 היום</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">מעקב לקוחות</span>
                </div>
                <span className="text-xs text-muted-foreground">156 היום</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">דוחות שבועיים</span>
                </div>
                <span className="text-xs text-muted-foreground">מושהה</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                זרימה חדשה
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Processing */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>עיבוד נתונים חכם</CardTitle>
                <CardDescription>
                  ניתוח ועיבוד נתונים באמצעות AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">ניתוח רגש לקוחות</span>
                <Badge className="bg-green-100 text-green-800">92% חיובי</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">חיזוי מכירות</span>
                <Badge className="bg-blue-100 text-blue-800">+15% חודש הבא</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">סיווג מסמכים</span>
                <Badge className="bg-orange-100 text-orange-800">2,341 היום</Badge>
              </div>
            </div>
            <Button size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 me-2" />
              דוח מפורט
            </Button>
          </CardContent>
        </Card>

        {/* API Integration */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>API ואינטגרציות</CardTitle>
                <CardDescription>
                  חיבור לשירותי AI חיצוניים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">OpenAI GPT</span>
                </div>
                <Badge variant="secondary">מחובר</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Google AI</span>
                </div>
                <Badge variant="secondary">מחובר</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">Claude AI</span>
                </div>
                <Badge variant="outline">לא מוגדר</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                הוסף חיבור
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="h-5 w-5" />
                מוכנים להתחיל עם AI?
              </h3>
              <p className="text-muted-foreground">
                גלו איך הבינה המלאכותית שלנו יכולה לחסוך לכם זמן וכסף כבר היום
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/ai-automation/templates">
                  תבניות מוכנות
                </Link>
              </Button>
              <Button asChild>
                <Link href="/chat" className="flex items-center gap-2">
                  התחל צ&apos;אט
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}