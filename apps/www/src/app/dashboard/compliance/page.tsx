"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  FileText,
  Eye,
  Users,
  Calendar,
  Download,
  Settings,
  Plus,
  RefreshCw,
  Globe,
  Database,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function CompliancePage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          רגולציה ותאימות
        </h1>
        <p className="text-muted-foreground text-lg">
          ציות לתקנות, אבטחת מידע ובקרת פרטיות
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              רמת ציות כללית
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">94%</div>
            <p className="text-xs text-green-600">מעל הסטנדרט הנדרש</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              בדיקות אבטחה
            </CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">23</div>
            <p className="text-xs text-blue-600">החודש</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              הרשאות משתמשים
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">47</div>
            <p className="text-xs text-purple-600">משתמשים מאושרים</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              התרעות פתוחות
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">2</div>
            <p className="text-xs text-orange-600">דרישות טיפול</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GDPR Compliance */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>ציות GDPR</CardTitle>
                <CardDescription>
                  תקנות הגנת הפרטיות האירופיות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">הסכמות משתמשים</span>
                </div>
                <Badge className="bg-green-100 text-green-800">מתואם</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">זכות למחיקה</span>
                </div>
                <Badge className="bg-green-100 text-green-800">מיושם</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">דוח הגנת נתונים</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">דורש עדכון</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">בקשות GDPR החודש</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">כולן טופלו בזמן</div>
            </div>
            
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 me-2" />
              צפה בדוח מלא
            </Button>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>אבטחת נתונים</CardTitle>
                <CardDescription>
                  הגנה והצפנת מידע רגיש
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">256-bit</div>
                <div className="text-xs text-muted-foreground">הצפנת SSL</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-600">99.9%</div>
                <div className="text-xs text-muted-foreground">זמינות</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">בדיקות אבטחה</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">סריקת פרצות</span>
                  <span className="text-xs text-green-600">עבר - 15/01</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">בדיקת חדירה</span>
                  <span className="text-xs text-green-600">עבר - 10/01</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ניטור אנומליות</span>
                  <span className="text-xs text-blue-600">פעיל 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <RefreshCw className="h-4 w-4 me-2" />
                בדיקה חדשה
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>מעקב פעילות</CardTitle>
                <CardDescription>
                  לוג פעילות ומעקב שינויים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">התחברות מנהל</div>
                  <div className="text-xs text-muted-foreground">דני כהן - 14:30</div>
                </div>
                <Badge variant="secondary">רגיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">עדכון הרשאות</div>
                  <div className="text-xs text-muted-foreground">מירי לוי - 13:15</div>
                </div>
                <Badge className="bg-green-100 text-green-800">מאושר</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">ניסיון התחברות חשוד</div>
                  <div className="text-xs text-muted-foreground">IP זר - 11:45</div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">נחסם</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">פעילות היום</div>
              <div className="text-2xl font-bold">156 אירועים</div>
              <div className="text-xs text-muted-foreground">כולם תקינים</div>
            </div>
            
            <Button size="sm" className="w-full">
              <Download className="h-4 w-4 me-2" />
              ייצא לוג מלא
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Documents */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>מסמכי ציות</CardTitle>
                <CardDescription>
                  מדיניות ונהלי רגולציה
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">מדיניות פרטיות</span>
                <div className="text-left">
                  <Badge variant="secondary">עדכני</Badge>
                  <div className="text-xs text-muted-foreground mt-1">עודכן: 01/01/25</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">תנאי שימוש</span>
                <div className="text-left">
                  <Badge variant="secondary">עדכני</Badge>
                  <div className="text-xs text-muted-foreground mt-1">עודכן: 15/12/24</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">נוהל אבטחת מידע</span>
                <div className="text-left">
                  <Badge className="bg-yellow-100 text-yellow-800">דורש עדכון</Badge>
                  <div className="text-xs text-muted-foreground mt-1">עודכן: 01/11/24</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">הסכם עיבוד נתונים</span>
                <div className="text-left">
                  <Badge variant="secondary">עדכני</Badge>
                  <div className="text-xs text-muted-foreground mt-1">עודכן: 20/12/24</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                מסמך חדש
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">הערכת סיכונים</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">סיכון כללי: נמוך</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">23 בדיקות</span>
                <span className="text-blue-600">0 סיכונים</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">גיבוי נתונים</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">גיבוי אחרון: היום 03:00</div>
              <div className="text-xs">
                <span className="text-green-600">הצליח - 2.3GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">ניטור אבטחה</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">מעקב 24/7 פעיל</div>
              <div className="text-xs">
                <span className="text-green-600">156 אירועים היום</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="h-5 w-5" />
                רמת ציות מעולה - 94%
              </h3>
              <p className="text-green-700">
                המערכת שלכם עומדת בכל הדרישות הרגולטוריות
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-300 hover:bg-green-50" asChild>
                <Link href="/dashboard/compliance/reports">
                  <Download className="h-4 w-4 me-2" />
                  דוח ציות
                </Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/compliance/audit">
                  ביקורת חדשה
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}