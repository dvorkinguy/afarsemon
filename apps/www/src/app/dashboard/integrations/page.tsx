"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Puzzle,
  CheckCircle,
  Zap,
  Globe,
  Database,
  Mail,
  MessageSquare,
  CreditCard,
  BarChart3,
  Plus,
  Settings,
  RefreshCw,
  Activity,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Puzzle className="h-8 w-8 text-primary" />
          אינטגרציות
        </h1>
        <p className="text-muted-foreground text-lg">
          חיבור למערכות חיצוניות, APIs ושירותים עסקיים
        </p>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              אינטגרציות פעילות
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">23</div>
            <p className="text-xs text-green-600">מתוך 27 זמינות</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              API Calls היום
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">12,547</div>
            <p className="text-xs text-blue-600">+18% מאתמול</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              זמן תגובה ממוצע
            </CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">234ms</div>
            <p className="text-xs text-purple-600">-15ms שיפור</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              שיעור הצלחה
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">99.2%</div>
            <p className="text-xs text-orange-600">ביצועים מעולים</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CRM Integration */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>מערכות CRM</CardTitle>
                  <CardDescription>
                    חיבור למערכות ניהול לקוחות
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Salesforce</div>
                    <div className="text-xs text-muted-foreground">2,341 רשומות מסונכרנות</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">מחובר</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">HubSpot</div>
                    <div className="text-xs text-muted-foreground">856 אנשי קשר</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">מחובר</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Pipedrive</div>
                    <div className="text-xs text-muted-foreground">דורש הגדרה</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">בהמתנה</Badge>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 me-2" />
              הוסף CRM חדש
            </Button>
          </CardContent>
        </Card>

        {/* Communication Tools */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>כלי תקשורת</CardTitle>
                <CardDescription>
                  חיבור לפלטפורמות תקשורת
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Slack</div>
                    <div className="text-xs text-muted-foreground">3 ערוצים מחוברים</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Microsoft Teams</div>
                    <div className="text-xs text-muted-foreground">תמיכה חכמה</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">WhatsApp Business</div>
                    <div className="text-xs text-muted-foreground">API מוכן להפעלה</div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">זמין</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <LinkIcon className="h-4 w-4 me-2" />
                חבר פלטפורמה
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Systems */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>מערכות תשלום</CardTitle>
                <CardDescription>
                  אינטגרציה לשירותי תשלום
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">PayPal</div>
                    <div className="text-xs text-muted-foreground">₪45,230 החודש</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Stripe</div>
                    <div className="text-xs text-muted-foreground">89 עסקאות</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Bit</div>
                    <div className="text-xs text-muted-foreground">תשלומים מקומיים</div>
                  </div>
                </div>
                <Badge variant="outline">לא מחובר</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium mb-1">סכום תשלומים החודש</div>
              <div className="text-2xl font-bold text-green-700">₪67,890</div>
            </div>
            
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 me-2" />
              הוסף שירות תשלום
            </Button>
          </CardContent>
        </Card>

        {/* Marketing Tools */}
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>כלי שיווק</CardTitle>
                <CardDescription>
                  אוטומציה שיווקית ומיילים
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Mailchimp</div>
                    <div className="text-xs text-muted-foreground">2,341 מנויים</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">מסונכרן</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Google Analytics</div>
                    <div className="text-xs text-muted-foreground">מעקב אירועים</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Facebook Ads</div>
                    <div className="text-xs text-muted-foreground">מוכן להפעלה</div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">זמין</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted/50 rounded text-center">
                <div className="font-medium">שיעור פתיחה</div>
                <div className="text-green-600">18.4%</div>
              </div>
              <div className="p-2 bg-muted/50 rounded text-center">
                <div className="font-medium">שיעור לחיצה</div>
                <div className="text-blue-600">3.2%</div>
              </div>
            </div>
            
            <Button size="sm" className="w-full">
              <Zap className="h-4 w-4 me-2" />
              הגדר אוטומציה
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">API Endpoints</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">27 endpoints פעילים</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">25 תקינים</span>
                <span className="text-yellow-600">2 איטיים</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">מעקב ביצועים</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">זמן תגובה: 234ms</div>
              <div className="text-xs">
                <span className="text-green-600">שיפור של 15ms השבוע</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">סנכרון נתונים</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">סנכרון אחרון: לפני 5 דק&apos;</div>
              <div className="text-xs">
                <span className="text-blue-600">3,456 רשומות עודכנו</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Health */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-right">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2 justify-center md:justify-start">
                <CheckCircle className="h-5 w-5" />
                כל האינטגרציות פועלות בצורה מעולה!
              </h3>
              <p className="text-muted-foreground">
                99.2% זמינות עם זמן תגובה מהיר של 234ms בממוצע
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/integrations/monitor">
                  <Activity className="h-4 w-4 me-2" />
                  מוניטור ביצועים
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/integrations/marketplace">
                  <Plus className="h-4 w-4 me-2" />
                  חנות אינטגרציות
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}