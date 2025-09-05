"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CalConfig {
  theme?: string;
  locale?: string;
  debug?: boolean;
}

interface CalInlineOptions {
  elementOrSelector: string;
  calLink: string;
  config?: CalConfig;
}

interface CalInitOptions {
  debug?: boolean;
  calOrigin?: string;
}

interface CalEvent {
  detail: {
    data: Record<string, unknown>;
    type: string;
    namespace?: string;
  };
}

interface CalEventOptions {
  action: string;
  callback: (event: CalEvent) => void;
}

interface CalInstance {
  (action: "init", options?: CalInitOptions): void;
  (action: "inline", options: CalInlineOptions): void;
  (action: "modal", options?: Record<string, unknown>): void;
  (action: "prerender", options?: Record<string, unknown>): void;
  (action: "on", options: CalEventOptions): void;
  loaded?: boolean;
  q?: unknown[];
  ns?: Record<string, CalInstance>;
}

declare global {
  interface Window {
    Cal?: CalInstance;
  }
}

export function BookingCalendar() {
  const [isClient, setIsClient] = useState(false);
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error' | 'timeout'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openInNewTab = useCallback(() => {
    window.open("https://cal.com/afarsemon/40min", "_blank", "noopener,noreferrer");
  }, []);

  const initializeCalOfficial = useCallback(() => {
    try {
      // Official Cal.com embed snippet pattern
      (function (C: Window, A: string, L: string) { 
        const p = function (a: CalInstance, ar: unknown[]) { 
          if (a.q) a.q.push(ar); 
        }; 
        const d = C.document; 
        C.Cal = C.Cal || function (...args: unknown[]) { 
          const cal = C.Cal as CalInstance; 
          const ar = args; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            const script = d.createElement("script");
            script.src = A;
            script.async = true;
            d.head.appendChild(script);
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function (...apiArgs: unknown[]) { p(api as CalInstance, apiArgs); }; 
            const namespace = ar[1]; 
            (api as CalInstance).q = (api as CalInstance).q || []; 
            if (typeof namespace === "string") {
              if (cal.ns) cal.ns[namespace] = api as CalInstance;
              p(api as CalInstance, ar); 
            } else {
              p(cal, ar); 
            }
            return; 
          } 
          p(cal, ar); 
        } as CalInstance; 
      })(window, "https://cal.com/embed.js", "init");

      // Initialize Cal.com
      if (window.Cal) {
        window.Cal("init", {
          debug: process.env.NODE_ENV === 'development',
          calOrigin: "https://cal.com"
        });
      }

      // Set up event listeners
      if (window.Cal) {
        window.Cal("on", {
          action: "linkReady",
          callback: (e: CalEvent) => {
            console.log("Cal.com link ready:", e.detail);
            setLoadingState('loaded');
          }
        });
      }

      if (window.Cal) {
        window.Cal("on", {
          action: "linkFailed", 
          callback: (e: CalEvent) => {
            console.error("Cal.com link failed:", e.detail);
            setLoadingState('error');
          }
        });
      }

      // Initialize inline embed
      if (window.Cal) {
        window.Cal("inline", {
          elementOrSelector: "#cal-embed-container",
          calLink: "afarsemon/40min",
          config: {
            theme: "auto",
            locale: "he"
          }
        });
      }

    } catch (error) {
      console.error('Failed to initialize Cal.com embed:', error);
      setLoadingState('error');
    }
  }, []);

  const retryLoad = useCallback(() => {
    if (retryCount >= maxRetries) {
      setLoadingState('timeout');
      return;
    }
    
    setLoadingState('loading');
    setRetryCount(prev => prev + 1);
    
    // Clean up existing embed
    const embedContainer = document.getElementById('cal-embed-container');
    if (embedContainer) {
      embedContainer.innerHTML = '';
    }
    
    // Remove existing script
    const existingScript = document.querySelector('script[src="https://cal.com/embed.js"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Reset Cal object
    if (window.Cal) {
      window.Cal.loaded = false;
    }
    
    // Retry initialization
    setTimeout(() => {
      initializeCalOfficial();
    }, 1000);
  }, [initializeCalOfficial, retryCount]);

  useEffect(() => {
    if (!isClient) return;

    // Set timeout for initialization
    const timeout = setTimeout(() => {
      if (loadingState === 'loading') {
        setLoadingState('timeout');
      }
    }, 10000);

    initializeCalOfficial();

    return () => {
      clearTimeout(timeout);
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src="https://cal.com/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [isClient, initializeCalOfficial, loadingState]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">קבעו פגישה</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              <span>בחרו זמן נוח לשיחת ייעוץ של 40 דקות</span>
              <Clock className="h-4 w-4 mr-2" />
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openInNewTab}
            className="flex items-center gap-2"
          >
            פתח בחלון חדש
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isClient ? (
          <div 
            style={{ 
              width: "100%", 
              height: "650px",
              borderRadius: "8px"
            }}
            className="flex items-center justify-center bg-muted/20"
          >
            <div className="text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <p>הכנת לוח הזמנים...</p>
            </div>
          </div>
        ) : loadingState === 'error' || loadingState === 'timeout' ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loadingState === 'timeout' 
                  ? 'פסק הזמן לטעינת לוח הזמנים. אנא נסו שוב או פתחו בחלון חדש.' 
                  : 'שגיאה בטעינת לוח הזמנים. אנא נסו שוב או פתחו בחלון חדש.'}
                {retryCount > 0 && ` (ניסיון ${retryCount + 1})`}
              </AlertDescription>
            </Alert>
            <div className="flex gap-4 justify-center">
              {retryCount < maxRetries && (
                <Button onClick={retryLoad} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  נסו שוב
                </Button>
              )}
              <Button onClick={openInNewTab} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                פתח בחלון חדש
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div 
              id="cal-embed-container" 
              style={{ 
                width: "100%", 
                height: "650px",
                overflow: "auto",
                borderRadius: "8px",
                direction: "rtl"
              }}
              className="w-full min-h-[650px] overflow-auto rounded-lg"
            >
              {loadingState === 'loading' && (
                <div className="flex items-center justify-center h-full bg-background/80 backdrop-blur-sm">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                    <p>טוען את לוח הזמנים...</p>
                    {retryCount > 0 && (
                      <p className="text-sm mt-2">ניסיון {retryCount + 1} מתוך {maxRetries + 1}</p>
                    )}
                    <Button 
                      variant="link" 
                      onClick={openInNewTab}
                      className="mt-2"
                    >
                      או פתחו בחלון חדש
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>פגישת ייעוץ אישית:</strong> 40 דקות של ייעוץ מקצועי בנושא אוטומציות AI לעסק שלכם.
            נדבר על הצרכים שלכם ונבנה תוכנית פעולה מותאמת אישית.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}