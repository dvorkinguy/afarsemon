"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Target,
  Activity,
  Database
} from "lucide-react";
import Link from "next/link";

export default function BusinessIntelligencePage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          מודיעין עסקי
        </h1>
        <p className="text-muted-foreground text-lg">
          ניתוח נתונים מתקדם, תובנות עסקיות ודשבורד אנליטיקס
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              ROI כללי
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">247%</div>
            <p className="text-xs text-blue-600">+23% מהרבעון הקודם</p>
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
            <div className="text-2xl font-bold text-green-700">1,247</div>
            <p className="text-xs text-green-600">+18% צמיחה חודשית</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              ערך לקוח (LTV)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">₪12,450</div>
            <p className="text-xs text-purple-600">ממוצע לקוח</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              שיעור נטישה
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">2.3%</div>
            <p className="text-xs text-orange-600">-0.8% שיפור</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>ניתוח הכנסות</CardTitle>
                  <CardDescription>
                    מגמות הכנסות והכנות
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">₪156K</div>
                <div className="text-xs text-muted-foreground">החודש</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">₪134K</div>
                <div className="text-xs text-muted-foreground">חודש קודם</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-700">+16%</div>
                <div className="text-xs text-muted-foreground">צמיחה</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">התפלגות הכנסות לפי מקור</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    מנויים חודשיים
                  </span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    פרויקטים חד פעמיים
                  </span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    שירותים נוספים
                  </span>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              תצוגה מפורטת
            </Button>
          </CardContent>
        </Card>

        {/* Customer Analytics */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>ניתוח לקוחות</CardTitle>
                <CardDescription>
                  התנהגות ומאפייני לקוחות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">לקוחות חדשים</div>
                  <div className="text-xs text-muted-foreground">החודש</div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-green-700">89</div>
                  <Badge className="bg-green-100 text-green-800">+12%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">לקוחות חוזרים</div>
                  <div className="text-xs text-muted-foreground">שיעור חזרה</div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-blue-700">73%</div>
                  <Badge className="bg-blue-100 text-blue-800">+5%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">שביעות רצון</div>
                  <div className="text-xs text-muted-foreground">ממוצע דירוגים</div>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-purple-700">4.8/5</div>
                  <Badge className="bg-purple-100 text-purple-800">מצוין</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">פלח לקוחות בעל הערך הגבוה</div>
              <div className="text-xs text-muted-foreground">עסקים בינוניים - 45% מההכנסות</div>
            </div>
            
            <Button size="sm" className="w-full">
              <Target className="h-4 w-4 me-2" />
              ניתוח פילוח
            </Button>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>מדדי ביצוע</CardTitle>
                <CardDescription>
                  KPIs עיסקיים מרכזיים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">94%</div>
                <div className="text-xs text-muted-foreground">זמינות מערכת</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">1.2 שניות</div>
                <div className="text-xs text-muted-foreground">זמן טעינה</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-600">87%</div>
                <div className="text-xs text-muted-foreground">שיעור המרה</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-600">3.2%</div>
                <div className="text-xs text-muted-foreground">שיעור נטישה</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">יעדים חודשיים</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>הכנסות</span>
                  <span>104% מהיעד</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '104%' }}></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span>לקוחות חדשים</span>
                  <span>89% מהיעד</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 me-2" />
              דשבורד מלא
            </Button>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>מקורות נתונים</CardTitle>
                <CardDescription>
                  חיבורים ועדכוני נתונים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">מערכת CRM</span>
                </div>
                <Badge variant="secondary">מסונכרן</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Google Analytics</span>
                </div>
                <Badge variant="secondary">מסונכרן</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">מערכת הנהלת חשבונות</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בעדכון</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm font-medium">רשתות חברתיות</span>
                </div>
                <Badge variant="outline">לא מחובר</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 me-2" />
                רענן נתונים
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">דוח יומי</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">עדכון אוטומטי בכל יום ב-9:00</div>
              <div className="text-xs text-green-600">דוח אחרון: היום, 09:15</div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">דוח שבועי</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">סיכום ביצועים שבועיים</div>
              <div className="text-xs text-blue-600">דוח אחרון: יום ראשון</div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">דוח חודשי</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">ניתוח מגמות והשוואות</div>
              <div className="text-xs text-purple-600">דוח אחרון: 1 בחודש</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2 justify-center md:justify-start">
                <Activity className="h-5 w-5" />
                הביצועים שלכם מעולים!
              </h3>
              <p className="text-muted-foreground">
                צמיחה חזקה של 16% בחודש האחרון ושיפור בכל המדדים
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/business-intelligence/reports">
                  <Download className="h-4 w-4 me-2" />
                  ייצא דוחות
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/business-intelligence/insights">
                  תובנות מתקדמות
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}