"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  PieChart,
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download,
  Plus,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          פיננסים וחשבונאית
        </h1>
        <p className="text-muted-foreground text-lg">
          ניהול כספי, דוחות מס וחשבונאית מתקדמת
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              הכנסות החודש
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">₪156,430</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% מהחודש הקודם
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              הוצאות החודש
            </CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">₪87,200</div>
            <p className="text-xs text-red-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% מהחודש הקודם
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              רווח נקי
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">₪69,230</div>
            <p className="text-xs text-blue-600">44.3% מהכנסות</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              זרימת מזומנים
            </CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">₪234,500</div>
            <p className="text-xs text-purple-600">יתרה בבנק</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>תנועות אחרונות</CardTitle>
                  <CardDescription>
                    הכנסות והוצאות לאחרונה
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">תשלום לקוח - חברת ABC</div>
                    <div className="text-xs text-muted-foreground">היום, 14:30</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-green-700">+₪15,000</div>
                  <Badge className="bg-green-100 text-green-800">הכנסה</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">שכירות משרד</div>
                    <div className="text-xs text-muted-foreground">אתמול, 09:15</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-red-700">-₪8,500</div>
                  <Badge className="bg-red-100 text-red-800">הוצאה</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">משכורות צוות</div>
                    <div className="text-xs text-muted-foreground">לפני יומיים</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-700">-₪45,000</div>
                  <Badge className="bg-blue-100 text-blue-800">משכורת</Badge>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 me-2" />
              רשום תנועה חדשה
            </Button>
          </CardContent>
        </Card>

        {/* Invoicing */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>חשבוניות</CardTitle>
                <CardDescription>
                  ניהול חשבוניות ותשלומים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-700">12</div>
                <div className="text-xs text-muted-foreground">בהמתנה</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">34</div>
                <div className="text-xs text-muted-foreground">שולמו</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-700">3</div>
                <div className="text-xs text-muted-foreground">באיחור</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">חשבונית #1234</div>
                  <div className="text-xs text-muted-foreground">חברת XYZ</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">₪12,000</div>
                  <Badge className="bg-yellow-100 text-yellow-800">ממתין</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">חשבונית #1233</div>
                  <div className="text-xs text-muted-foreground">חברת ABC</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">₪8,500</div>
                  <Badge className="bg-green-100 text-green-800">שולם</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                חשבונית חדשה
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tax Management */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>ניהול מסים</CardTitle>
                <CardDescription>
                  דוחות מס ומע&quot;מ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">דוח מע&quot;מ - דצמבר</span>
                </div>
                <Badge className="bg-green-100 text-green-800">הוגש</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">דוח מע&quot;מ - ינואר</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בהכנה</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">דוח שנתי 2024</span>
                </div>
                <Badge variant="destructive">דחוף</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">יעד מס לשנה</div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">₪45,000</div>
                <Badge variant="outline">75% הושלם</Badge>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <FileText className="h-4 w-4 me-2" />
              צור דוח מס
            </Button>
          </CardContent>
        </Card>

        {/* Budget Tracking */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>מעקב תקציב</CardTitle>
                <CardDescription>
                  בקרת הוצאות וחיסכון
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>שיווק ופרסום</span>
                  <span>₪12,000 / ₪15,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>משכורות</span>
                  <span>₪45,000 / ₪50,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>הוצאות תפעוליות</span>
                  <span>₪8,500 / ₪10,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 font-medium">חיסכון החודש: ₪7,800</div>
              <div className="text-xs text-green-600">13% מהתקציב החודשי</div>
            </div>
            
            <Button size="sm" className="w-full">
              <Calendar className="h-4 w-4 me-2" />
              תכנון תקציב
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Financial Reports */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 justify-center md:justify-start">
                <TrendingUp className="h-5 w-5" />
                רווחיות של 44% - מצוין!
              </h3>
              <p className="text-blue-700">
                הביצועים הכלכליים שלכם חזקים ויציבים
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-blue-300 hover:bg-blue-50" asChild>
                <Link href="/dashboard/finance/reports">
                  <Download className="h-4 w-4 me-2" />
                  דוחות כספיים
                </Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/dashboard/finance/planning">
                  תכנון פיננסי
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}