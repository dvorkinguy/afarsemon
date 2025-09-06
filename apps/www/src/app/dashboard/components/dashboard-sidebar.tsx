"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bot,
  HeadphonesIcon,
  TrendingUp,
  Settings,
  Calculator,
  BarChart3,
  FileText,
  Shield,
  Puzzle,
  Building,
  Home,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

const navigation = [
  {
    name: "דשבורד ראשי",
    href: "/dashboard",
    icon: Home,
    description: "סקירה כללית של המערכת"
  },
  {
    name: "פלטפורמת AI ואוטומציה",
    href: "/dashboard/ai-automation",
    icon: Bot,
    description: "כלי בינה מלאכותית ואוטומציה"
  },
  {
    name: "שירות לקוחות",
    href: "/dashboard/customer-service",
    icon: HeadphonesIcon,
    description: "ניהול תמיכה וקשר עם לקוחות"
  },
  {
    name: "מכירות ושיווק",
    href: "/dashboard/sales-marketing",
    icon: TrendingUp,
    description: "כלי מכירות, ליידים ושיווק"
  },
  {
    name: "תפעול וניהול",
    href: "/dashboard/operations",
    icon: Settings,
    description: "ניהול תהליכים ומשאבים"
  },
  {
    name: "פיננסים וחשבונאית",
    href: "/dashboard/finance",
    icon: Calculator,
    description: "ניהול כספי ודוחות כספיים"
  },
  {
    name: "מודיעין עסקי",
    href: "/dashboard/business-intelligence",
    icon: BarChart3,
    description: "ניתוח נתונים ותובנות עסקיות"
  },
  {
    name: "יצירת תוכן ועיבוד שפה",
    href: "/dashboard/content-nlp",
    icon: FileText,
    description: "כלי יצירת תוכן ועיבוד שפה"
  },
  {
    name: "רגולציה ותאימות",
    href: "/dashboard/compliance",
    icon: Shield,
    description: "ציות לתקנות ואבטחת מידע"
  },
  {
    name: "אינטגרציות",
    href: "/dashboard/integrations",
    icon: Puzzle,
    description: "חיבור למערכות חיצוניות"
  },
  {
    name: "פתרונות ורטיקליים",
    href: "/dashboard/vertical-solutions",
    icon: Building,
    description: "פתרונות לענפים ספציפיים"
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "border-l bg-card transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-80"
      )}
      role="navigation"
      aria-label="ניווט דשבורד ראשי"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              אפרסמון
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
          aria-label={collapsed ? "הרחב סרגל צד" : "כווץ סרגל צד"}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4" role="menubar">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-accent",
                  isActive && "bg-accent text-accent-foreground shadow-sm",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} aria-hidden="true" />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-medium truncate", isActive && "text-primary")}>
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <div className="text-xs text-muted-foreground text-center">
            <div className="font-medium">אפרסמון AI</div>
            <div>פלטפורמת בינה מלאכותית לעסקים</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}