"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  Users,
  Target,
  Mail,
  Phone,
  DollarSign,
  BarChart3,
  PieChart,
  MessageSquare,
  Eye,
  MousePointer,
  Plus,
  Settings,
  Filter,
  Download
} from "lucide-react";
import Link from "next/link";

export default function SalesMarketingPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          מכירות ושיווק
        </h1>
        <p className="text-muted-foreground text-lg">
          ניהול ליידים, קמפיינים ומעקב אחר ביצועי המכירות
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              מכירות החודש
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">₪125,430</div>
            <p className="text-xs text-green-600">+18% מהחודש הקודם</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              ליידים חדשים
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">47</div>
            <p className="text-xs text-blue-600">השבוע</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              שיעור המרה
            </CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">12.5%</div>
            <p className="text-xs text-purple-600">+2.3% שיפור</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              עסקאות פתוחות
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">₪89,200</div>
            <p className="text-xs text-orange-600">23 עסקאות</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>משפך מכירות</CardTitle>
                  <CardDescription>
                    מעקב אחר שלבי המכירה
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">לידים חדשים</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">47</span>
                  <Badge className="bg-blue-100 text-blue-800">₪234K</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">הצעות מחיר</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">23</span>
                  <Badge className="bg-purple-100 text-purple-800">₪156K</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">משא ומתן</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">12</span>
                  <Badge className="bg-green-100 text-green-800">₪89K</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">סגירה</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">6</span>
                  <Badge className="bg-orange-100 text-orange-800">₪45K</Badge>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              תצוגה מפורטת
            </Button>
          </CardContent>
        </Card>

        {/* Marketing Campaigns */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>קמפיינים פעילים</CardTitle>
                <CardDescription>
                  ביצועי קמפיינים שיווקיים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">קמפיין Google Ads</div>
                  <div className="text-xs text-muted-foreground">23 קליקים היום</div>
                </div>
                <div className="text-left">
                  <Badge variant="secondary">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">₪1,200 הוצאה</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">קמפיין Facebook</div>
                  <div className="text-xs text-muted-foreground">156 הגעות</div>
                </div>
                <div className="text-left">
                  <Badge variant="secondary">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">₪800 הוצאה</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">מייל מרקטינג</div>
                  <div className="text-xs text-muted-foreground">2,341 נשלחו</div>
                </div>
                <div className="text-left">
                  <Badge className="bg-green-100 text-green-800">הושלם</Badge>
                  <div className="text-xs text-muted-foreground mt-1">18% פתיחות</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                קמפיין חדש
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lead Management */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>ניהול לידים</CardTitle>
                <CardDescription>
                  מעקב אחר לקוחות פוטנציאליים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">ד</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">דני כהן</div>
                    <div className="text-xs text-muted-foreground">חברת טכנולוגיה</div>
                  </div>
                </div>
                <div className="text-left">
                  <Badge variant="destructive">חם</Badge>
                  <div className="text-xs text-muted-foreground mt-1">₪25K</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">מ</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">מירי לוי</div>
                    <div className="text-xs text-muted-foreground">סטארט-אפ</div>
                  </div>
                </div>
                <div className="text-left">
                  <Badge className="bg-yellow-100 text-yellow-800">חמים</Badge>
                  <div className="text-xs text-muted-foreground mt-1">₪15K</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">א</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">אבי דוד</div>
                    <div className="text-xs text-muted-foreground">חברה בינונית</div>
                  </div>
                </div>
                <div className="text-left">
                  <Badge className="bg-blue-100 text-blue-800">קרים</Badge>
                  <div className="text-xs text-muted-foreground mt-1">₪8K</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                ליד חדש
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics & Reports */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>ניתוח ודוחות</CardTitle>
                <CardDescription>
                  תובנות על ביצועי המכירות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-primary">3.2</div>
                <div className="text-xs text-muted-foreground">ימים ממוצע לסגירה</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">₪21,500</div>
                <div className="text-xs text-muted-foreground">ערך עסקה ממוצע</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>מקור הלידים</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    אתר האינטרנט
                  </span>
                  <span>45%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    רשתות חברתיות
                  </span>
                  <span>30%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    הפניות
                  </span>
                  <span>25%</span>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 me-2" />
              דוח מפורט
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Communication Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">מייל מרקטינג</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">קמפיין אחרון: 2,341 נשלחו</div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  18% פתחו
                </span>
                <span className="flex items-center gap-1">
                  <MousePointer className="h-3 w-3" />
                  3.2% לחצו
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">SMS מרקטינג</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">856 הודעות נשלחו החודש</div>
              <div className="text-xs">
                <span className="text-green-600">92% הגיעו בהצלחה</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">שיחות מכירות</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">34 שיחות השבוع</div>
              <div className="text-xs">
                <span className="text-purple-600">זמן ממוצע: 12 דקות</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Metrics */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2 justify-center md:justify-start">
                <TrendingUp className="h-5 w-5" />
                צמיחה של 18% החודש!
              </h3>
              <p className="text-muted-foreground">
                הביצועים שלכם משתפרים מחודש לחודש - המשיכו כך!
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/sales-marketing/reports">
                  דוחות מפורטים
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/sales-marketing/campaigns">
                  קמפיין חדש
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}