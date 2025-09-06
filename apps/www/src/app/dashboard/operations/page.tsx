"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Users,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Truck,
  Package,
  MapPin,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function OperationsPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          תפעול וניהול
        </h1>
        <p className="text-muted-foreground text-lg">
          ניהול תהליכים עסקיים, משאבים ומעקב אחר פרודוקטיביות
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              משימות פעילות
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">47</div>
            <p className="text-xs text-blue-600">23 בעדיפות גבוהה</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              פרודוקטיביות
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">87%</div>
            <p className="text-xs text-green-600">+5% מהשבוע הקודם</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              צוות פעיל
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">12/15</div>
            <p className="text-xs text-purple-600">3 בחופש</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              זמן מענה
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">1.5 שעות</div>
            <p className="text-xs text-orange-600">ממוצע יומי</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Management */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>ניהול משימות</CardTitle>
                  <CardDescription>
                    מעקב אחר משימות וביצוע
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
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">עדכון מערכת CRM</div>
                    <div className="text-xs text-muted-foreground">תאריך יעד: היום</div>
                  </div>
                </div>
                <Badge variant="destructive">דחוף</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">דוח רבעוני</div>
                    <div className="text-xs text-muted-foreground">תאריך יעד: מחר</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בתהליך</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">הכשרת עובדים</div>
                    <div className="text-xs text-muted-foreground">תאריך יעד: שבוע הבא</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">מתוכנן</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                משימה חדשה
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resource Management */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>ניהול משאבים</CardTitle>
                <CardDescription>
                  מלאי וזמינות משאבים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">ציוד משרדי</span>
                </div>
                <div className="text-left">
                  <Badge variant="secondary">זמין</Badge>
                  <div className="text-xs text-muted-foreground mt-1">85% במלאי</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">כח אדם</span>
                </div>
                <div className="text-left">
                  <Badge variant="secondary">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">12/15 עובדים</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">ציוד טכנולוגי</span>
                </div>
                <div className="text-left">
                  <Badge className="bg-yellow-100 text-yellow-800">בבדיקה</Badge>
                  <div className="text-xs text-muted-foreground mt-1">2 פריטים</div>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 me-2" />
              דוח משאבים
            </Button>
          </CardContent>
        </Card>

        {/* Process Automation */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>אוטומציה תפעולית</CardTitle>
                <CardDescription>
                  תהליכים אוטומטיים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">עיבוד הזמנות</span>
                <div className="text-left">
                  <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">89 היום</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">דוחות אוטומטיים</span>
                <div className="text-left">
                  <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">יומי ב-9:00</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">גיבוי נתונים</span>
                <div className="text-left">
                  <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                  <div className="text-xs text-muted-foreground mt-1">כל 4 שעות</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                תהליך חדש
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quality Control */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>בקרת איכות</CardTitle>
                <CardDescription>
                  מעקב אחר תקנים ואיכות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">94%</div>
                <div className="text-xs text-muted-foreground">שביעות רצון</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">2.1%</div>
                <div className="text-xs text-muted-foreground">שיעור שגיאות</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ביקורות איכות</span>
                <Badge variant="outline">3 השבוע</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>שירות לקוחות</span>
                  <span className="text-green-600">עבר ✓</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>תהליכי מכירות</span>
                  <span className="text-green-600">עבר ✓</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>אבטחת מידע</span>
                  <span className="text-yellow-600">בבדיקה</span>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <FileText className="h-4 w-4 me-2" />
              דוח איכות
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Logistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">לוגיסטיקה</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">12 משלוחים היום</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">8 נמסרו</span>
                <span className="text-blue-600">4 בדרך</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">מיקום צוות</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">8 עובדים במשרד</div>
              <div className="text-xs">
                <span className="text-blue-600">4 עובדים מהבית</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">לוח זמנים</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">5 פגישות היום</div>
              <div className="text-xs">
                <span className="text-purple-600">הבאה בעוד שעה</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 justify-center md:justify-start">
                <BarChart3 className="h-5 w-5" />
                יעילות תפעולית של 87%
              </h3>
              <p className="text-green-700">
                הביצועים שלכם מעולים! המשיכו לשפר את התהליכים
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-300 hover:bg-green-50" asChild>
                <Link href="/dashboard/operations/reports">
                  <Download className="h-4 w-4 me-2" />
                  דוחות
                </Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/operations/optimize">
                  שפר תהליכים
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}