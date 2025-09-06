"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HeadphonesIcon,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Plus,
  Settings,
  BarChart3,
  Filter,
  Search
} from "lucide-react";
import Link from "next/link";

export default function CustomerServicePage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HeadphonesIcon className="h-8 w-8 text-primary" />
          שירות לקוחות
        </h1>
        <p className="text-muted-foreground text-lg">
          ניהול תמיכה, מעקב פניות ושיפור חווית הלקוח
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              פניות פתוחות
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">23</div>
            <p className="text-xs text-green-600">-5 מאתמול</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              זמן מענה ממוצע
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">2.5 שעות</div>
            <p className="text-xs text-blue-600">שיפור של 20%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              שביעות רضון
            </CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">4.8/5</div>
            <p className="text-xs text-purple-600">מ-156 דירוגים</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              פניות השבוע
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">89</div>
            <p className="text-xs text-orange-600">+12% מהשבוע הקודם</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>פניות אחרונות</CardTitle>
                  <CardDescription>
                    פניות חדשות הדורשות טיפול
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
                    <div className="text-sm font-medium">בעיה בתשלום</div>
                    <div className="text-xs text-muted-foreground">לקוח: דני כהן</div>
                  </div>
                </div>
                <Badge variant="destructive">דחוף</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">שאלה טכנית</div>
                    <div className="text-xs text-muted-foreground">לקוח: שרה לוי</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בטיפול</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">בקשה לשינוי</div>
                    <div className="text-xs text-muted-foreground">לקוח: מיכל דוד</div>
                  </div>
                </div>
                <Badge variant="secondary">חדש</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                פנייה חדשה
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>ביצועי הצוות</CardTitle>
                <CardDescription>
                  סטטיסטיקות נציגי השירות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">ת</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">תמר כהן</div>
                    <div className="text-xs text-muted-foreground">24 פניות השבוע</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs">4.9</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">א</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">אבי לוי</div>
                    <div className="text-xs text-muted-foreground">18 פניות השבוע</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs">4.7</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">ר</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">רות דוד</div>
                    <div className="text-xs text-muted-foreground">21 פניות השבוע</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs">4.8</span>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 me-2" />
              דוח ביצועים מלא
            </Button>
          </CardContent>
        </Card>

        {/* Communication Channels */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>ערוצי תקשורת</CardTitle>
                <CardDescription>
                  ניהול כל ערוצי השירות
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">טלפון</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">34 שיחות</div>
                  <div className="text-xs text-muted-foreground">היום</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">אימייל</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">67 הודעות</div>
                  <div className="text-xs text-muted-foreground">היום</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">צ&apos;אט</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">89 שיחות</div>
                  <div className="text-xs text-muted-foreground">היום</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Plus className="h-4 w-4 me-2" />
                ערוץ חדש
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>בסיס ידע</CardTitle>
                <CardDescription>
                  מאמרים ופתרונות נפוצים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">שאלות נפוצות</div>
                <div className="text-xs text-muted-foreground">45 מאמרים</div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">מדריכי שימוש</div>
                <div className="text-xs text-muted-foreground">23 מדריכים</div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">פתרון בעיות</div>
                <div className="text-xs text-muted-foreground">67 פתרונות</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 me-2" />
                הוסף מאמר
              </Button>
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4 me-2" />
                חיפוש
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Satisfaction */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 justify-center md:justify-start">
                <Star className="h-5 w-5" />
                שביעות הרצון שלנו - 4.8/5
              </h3>
              <p className="text-green-700">
                הלקוחות שלנו מרוצים מהשירות המעולה שאנחנו מעניקים
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-300 hover:bg-green-50" asChild>
                <Link href="/dashboard/customer-service/surveys">
                  סקרי שביעות רצון
                </Link>
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/dashboard/customer-service/analytics">
                  ניתוח מפורט
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}