"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building,
  Stethoscope,
  GraduationCap,
  ShoppingCart,
  Car,
  Home,
  Factory,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Plus,
  Eye,
  Download,
  Sparkles,
  Target
} from "lucide-react";
import Link from "next/link";

export default function VerticalSolutionsPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          פתרונות ורטיקליים
        </h1>
        <p className="text-muted-foreground text-lg">
          פתרונות AI מותאמים לענפים ותחומים עסקיים ספציפיים
        </p>
      </div>

      {/* Vertical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              ענפים מכוסים
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">8</div>
            <p className="text-xs text-blue-600">תחומים מרכזיים</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              לקוחות פעילים
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">247</div>
            <p className="text-xs text-green-600">עסקים מכל הענפים</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              שיעור הצלחה
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">94%</div>
            <p className="text-xs text-purple-600">שביעות רצון לקוחות</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              חיסכון ממוצע
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">35%</div>
            <p className="text-xs text-orange-600">בעלויות תפעוליות</p>
          </CardContent>
        </Card>
      </div>

      {/* Industry Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Healthcare */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-base">בריאות ורפואה</CardTitle>
                <CardDescription className="text-xs">
                  פתרונות דיגיטליים למגזר הבריאות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              23 לקוחות פעילים
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>ניהול מטופלים</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>תזמון תורים</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>ניתוח רפואי AI</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">חינוך והכשרה</CardTitle>
                <CardDescription className="text-xs">
                  פלטפורמות למידה חכמות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              45 מוסדות חינוך
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>ניהול סטודנטים</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>מעקב הישגים</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>למידה מותאמת אישית</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>

        {/* E-commerce */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">מסחר אלקטרוני</CardTitle>
                <CardDescription className="text-xs">
                  חנויות אונליין חכמות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              67 חנויות מקוונות
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>המלצות אישיות</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>ניהול מלאי חכם</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>אנליטיקס מכירות</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>

        {/* Automotive */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">רכב ותחבורה</CardTitle>
                <CardDescription className="text-xs">
                  פתרונות טכנולוגיים לתחבורה
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              18 חברות רכב
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>ניהול צי רכב</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>מעקב GPS</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>תחזוקה חכמה</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>

        {/* Real Estate */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Home className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">נדל&quot;ן ובינוי</CardTitle>
                <CardDescription className="text-xs">
                  ניהול נכסים וחכמת מבנים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              34 חברות נדל&quot;ן
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>ניהול נכסים</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>הערכת נכסים AI</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>פלטפורמת שכירויות</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>

        {/* Manufacturing */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Factory className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-base">תעשייה וייצור</CardTitle>
                <CardDescription className="text-xs">
                  אוטומציה ובקרת איכות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              29 מפעלים
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>בקרת איכות AI</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>ניטור ציוד</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>אופטימיזציית ייצור</span>
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              פרטים נוספים
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories */}
      <Card className="group hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <CardTitle>סיפורי הצלחה</CardTitle>
              <CardDescription>
                דוגמאות למימושים מוצלחים בענפים שונים
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">מרפאת עיניים ד&quot;ר כהן</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                הפחתה של 40% בזמן המתנה לתורים
              </div>
              <Badge className="bg-green-100 text-green-800 text-xs">45% יעילות</Badge>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">חנות בגדי ילדים ABC</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                עלייה של 60% במכירות אונליין
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-xs">60% צמיחה</Badge>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Factory className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">מפעל מתכת בע&quot;מ</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                חיסכון של ₪50K חודשי בבקרת איכות
              </div>
              <Badge className="bg-purple-100 text-purple-800 text-xs">₪600K שנתי</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>פתרונות מותאמים</CardTitle>
                <CardDescription>
                  פיתוח פתרונות ייחודיים לעסק שלכם
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                הצוות שלנו מפתח פתרונות מותאמים אישית לכל ענף:
              </div>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  ניתוח צרכים מעמיק
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  פיתוח אג&apos;ילי
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  תמיכה מלאה 24/7
                </li>
              </ul>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 me-2" />
              בקש פתרון מותאם
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>ייעוץ ענפי</CardTitle>
                <CardDescription>
                  מומחי ענף לליווי מקצועי
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                המומחים שלנו מתמחים בענפים הבאים:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  בריאות
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  חינוך
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3" />
                  מסחר
                </div>
                <div className="flex items-center gap-1">
                  <Factory className="h-3 w-3" />
                  תעשייה
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Briefcase className="h-4 w-4 me-2" />
              קבע פגישת ייעוץ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Industry Performance */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 justify-center md:justify-start">
                <Building className="h-5 w-5" />
                247 עסקים נהנים מפתרונות מותאמים
              </h3>
              <p className="text-blue-700">
                שיעור הצלחה של 94% עם חיסכון ממוצע של 35% בעלויות תפעוליות
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-blue-300 hover:bg-blue-50" asChild>
                <Link href="/dashboard/vertical-solutions/case-studies">
                  <Download className="h-4 w-4 me-2" />
                  מקרי בוחן
                </Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/consultation">
                  <Sparkles className="h-4 w-4 me-2" />
                  התחל היום
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}