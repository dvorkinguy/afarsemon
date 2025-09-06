"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Brain,
  Languages,
  MessageSquare,
  Edit3,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Mic,
  Image,
  Plus,
  Settings,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function ContentNLPPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          יצירת תוכן ועיבוד שפה
        </h1>
        <p className="text-muted-foreground text-lg">
          כלי AI מתקדמים ליצירת תוכן, עיבוד שפה טבעית ותרגום
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              תוכן שנוצר
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">1,247</div>
            <p className="text-xs text-blue-600">מאמרים החודש</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              דיוק תרגום
            </CardTitle>
            <Languages className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">96.8%</div>
            <p className="text-xs text-green-600">ממוצע דיוק</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              זמן יצירה
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">2.3 דק&apos;</div>
            <p className="text-xs text-purple-600">ממוצע למאמר</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              שפות נתמכות
            </CardTitle>
            <Globe className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">27</div>
            <p className="text-xs text-orange-600">שפות זמינות</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Generation */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>יצירת תוכן AI</CardTitle>
                <CardDescription>
                  כתיבה אוטומטית של מאמרים ותוכן
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">מאמר בלוג - חדשנות טכנולוגית</div>
                  <div className="text-xs text-muted-foreground">הושלם לפני 5 דקות</div>
                </div>
                <Badge className="bg-green-100 text-green-800">מוכן</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">תיאורי מוצר - קטלוג</div>
                  <div className="text-xs text-muted-foreground">בתהליך יצירה</div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בתהליך</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">פוסטים לרשתות חברתיות</div>
                  <div className="text-xs text-muted-foreground">מחכה להפעלה</div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">ממתין</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                פרויקט חדש
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Processing */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>עיבוד שפה טבעית</CardTitle>
                <CardDescription>
                  ניתוח טקסט וחילוץ תובנות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">847</div>
                <div className="text-xs text-muted-foreground">טקסטים נותחו</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">94%</div>
                <div className="text-xs text-muted-foreground">דיוק ניתוח רגש</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">סוגי ניתוח זמינים</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ניתוח רגש</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">חילוץ מילות מפתח</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">זיהוי ישויות</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">סיכום אוטומטי</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Brain className="h-4 w-4 me-2" />
              התחל ניתוח
            </Button>
          </CardContent>
        </Card>

        {/* Translation Services */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Languages className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>שירותי תרגום</CardTitle>
                <CardDescription>
                  תרגום מתקדם בזמן אמת
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">עברית → אנגלית</span>
                  <Badge variant="secondary">פעיל</Badge>
                </div>
                <div className="text-xs text-muted-foreground">2,341 מילים תורגמו היום</div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">אנגלית → ערבית</span>
                  <Badge variant="secondary">פעיל</Badge>
                </div>
                <div className="text-xs text-muted-foreground">856 מילים תורגמו היום</div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">צרפתית → עברית</span>
                  <Badge variant="outline">זמין</Badge>
                </div>
                <div className="text-xs text-muted-foreground">לא בשימוש היום</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                תרגום חדש
              </Button>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Templates */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>תבניות תוכן</CardTitle>
                <CardDescription>
                  תבניות מוכנות ליצירת תוכן
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm font-medium">מאמרי בלוג</div>
                <div className="text-xs text-muted-foreground">12 תבניות</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-sm font-medium">מיילים</div>
                <div className="text-xs text-muted-foreground">8 תבניות</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm font-medium">רשתות חברתיות</div>
                <div className="text-xs text-muted-foreground">15 תבניות</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <div className="text-sm font-medium">מודעות</div>
                <div className="text-xs text-muted-foreground">6 תבניות</div>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <div className="text-sm font-medium mb-1">תבנית פופולרית השבוע</div>
              <div className="text-xs text-muted-foreground">&quot;מאמר טכנולוגי&quot; - 89 שימושים</div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <BookOpen className="h-4 w-4 me-2" />
                עיין בתבניות
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Processing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">עיבוד אודיו</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">המרה מדובר לטקסט</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">23 קבצים</span>
                <span className="text-blue-600">94% דיוק</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-green-600" aria-label="ניתוח תמונות" />
              <CardTitle className="text-base">ניתוח תמונות</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">זיהוי טקסט בתמונות</div>
              <div className="text-xs">
                <span className="text-green-600">156 תמונות נותחו</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">צ&apos;אטבוט תוכן</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">בוט עזרה ליצירת תוכן</div>
              <div className="text-xs">
                <span className="text-purple-600">234 שיחות היום</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 justify-center md:justify-start">
                <Zap className="h-5 w-5" />
                יעילות AI של 96.8%
              </h3>
              <p className="text-green-700">
                המערכת שלכם מייצרת תוכן איכותי במהירות מרבית
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-300 hover:bg-green-50" asChild>
                <Link href="/dashboard/content-nlp/analytics">
                  <TrendingUp className="h-4 w-4 me-2" />
                  ניתוח ביצועים
                </Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/content-nlp/create">
                  <Plus className="h-4 w-4 me-2" />
                  צור תוכן חדש
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}