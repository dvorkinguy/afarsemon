import Link from "next/link";
import { ArrowLeft, Bot, Zap, Sparkles, Users, BarChart, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="ml-2 h-3 w-3" />
            אוטומציה בינה מלאכותית לעסקים
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            אפרסמון - פלטפורמת AI
            <span className="text-primary"> לעסקים ישראלים</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            הפכו את העסק שלכם לחכם יותר עם אוטומציות AI מתקדמות.
            חסכו 70% מהזמן בתהליכים עסקיים, שפרו את חוויית הלקוח
            והגדילו את ההכנסות עם כלי AI מותאמים לשוק הישראלי.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/demos">
              <Button size="lg" className="group">
                צפו בדמואים חיים
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline">
                התחילו בחינם
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">עסקים פעילים</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">70%</div>
            <div className="text-sm text-muted-foreground">חיסכון בזמן</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">זמינות מלאה</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">₪1M+</div>
            <div className="text-sm text-muted-foreground">נחסך ללקוחות</div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">אוטומציות AI שמשנות את המשחק</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <Bot className="h-10 w-10 text-primary mb-4" />
                <CardTitle>צ&apos;אטבוט חכם 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  מענה אוטומטי ללקוחות בעברית, הבנת הקשר,
                  וטיפול בפניות מורכבות. חיסכון של 80% בזמן תמיכה.
                </p>
                <Badge variant="outline">ROI: 300% ב-3 חודשים</Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>אוטומציית מכירות</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  זיהוי לידים חמים, שליחת הצעות מחיר אוטומטיות,
                  ומעקב חכם אחרי לקוחות פוטנציאליים.
                </p>
                <Badge variant="outline">הגדלת מכירות: 45%</Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <BarChart className="h-10 w-10 text-primary mb-4" />
                <CardTitle>ניתוח נתונים חכם</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  דוחות אוטומטיים, תחזיות מכירות מדויקות,
                  וזיהוי הזדמנויות עסקיות בזמן אמת.
                </p>
                <Badge variant="outline">דיוק תחזיות: 92%</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Partners */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">משתלב עם הכלים שאתם כבר משתמשים</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            <div className="text-lg font-semibold">n8n</div>
            <div className="text-lg font-semibold">Make.com</div>
            <div className="text-lg font-semibold">Zapier</div>
            <div className="text-lg font-semibold">Monday.com</div>
            <div className="text-lg font-semibold">WhatsApp Business</div>
            <div className="text-lg font-semibold">Google Workspace</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">אבטחה ישראלית</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                עמידה בתקני אבטחה מחמירים
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">עברית מושלמת</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                הבנת סלנג וניואנסים ישראליים
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">תמיכה מקומית</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                צוות ישראלי זמין בכל שעה
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">הטמעה מהירה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                התחילו לעבוד תוך 24 שעות
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">מוכנים לקפיצת המדרגה?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            הצטרפו למאות עסקים ישראלים שכבר חוסכים זמן וכסף עם אפרסמון
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/demos">
              <Button size="lg" className="group">
                ראו דמו חי
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline">
                דברו איתנו
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}