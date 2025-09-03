"use client";

import React, { useState, useTransition, useCallback } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  LogOut, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  // AlertCircle, // Not used in current implementation
  RefreshCw,
  Wifi
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SignOutState {
  isLoading: boolean;
  error?: string;
  canRetry: boolean;
}

export const UserProfile = React.memo(function UserProfile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isPendingAction, startTransition] = useTransition();
  const [signOutState, setSignOutState] = useState<SignOutState>({
    isLoading: false,
    canRetry: false
  });

  // Enhanced sign out with error handling and retry
  const handleSignOut = useCallback(async () => {
    startTransition(async () => {
      try {
        setSignOutState({ isLoading: true, canRetry: false });
        
        await signOut();
        router.replace("/");
      } catch (error) {
        console.error("Sign out error:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'שגיאה לא צפויה';
        setSignOutState({
          isLoading: false,
          error: `שגיאה בהתנתקות: ${errorMessage}`,
          canRetry: true
        });
      }
    });
  }, [router, startTransition]);

  // Retry sign out
  const handleRetrySignOut = useCallback(() => {
    setSignOutState({ isLoading: false, canRetry: false });
    handleSignOut();
  }, [handleSignOut]);

  if (isPending) {
    return (
      <div className="flex items-center gap-3" role="status" aria-label="טוען פרופיל משתמש">
        <div className="relative">
          <Skeleton className="h-10 w-10 rounded-full" />
          {/* Animated loading ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary/50 animate-spin" aria-hidden="true"></div>
        </div>
        <div className="hidden md:block space-y-2">
          <Skeleton className="h-3 w-24 animate-pulse" />
          <Skeleton className="h-2 w-20 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        
        {/* Screen reader loading announcement */}
        <div className="sr-only" aria-live="polite">
          טוען פרטי משתמש...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Link href="/auth">
        <Button 
          className="group relative overflow-hidden transition-all duration-200 hover:scale-105"
          aria-label="התחברות לחשבון"
        >
          <span className="relative z-10 flex items-center gap-2">
            <User className="h-4 w-4" aria-hidden="true" />
            התחברות
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-all duration-300" aria-hidden="true" />
          
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" aria-hidden="true"></div>
        </Button>
      </Link>
    );
  }

  const userInitials = (
    session.user?.name?.split(" ").map(n => n[0]).join("") ||
    session.user?.email?.[0] ||
    "מ"
  ).toUpperCase();

  return (
    <>
      {/* Error display for sign-out failures */}
      {signOutState.error && (
        <div className="fixed top-4 end-4 z-50">
          <Alert variant="destructive" className="w-80" role="alert" aria-live="assertive">
            <div className="flex items-start gap-2">
              <Wifi className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 space-y-2">
                <AlertDescription>{signOutState.error}</AlertDescription>
                {signOutState.canRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetrySignOut}
                    className="h-7 px-2 text-xs"
                    aria-label="נסו שוב להתנתק"
                  >
                    <RefreshCw className="h-3 w-3 me-1" aria-hidden="true" />
                    נסו שוב
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "relative h-10 w-10 rounded-full p-0 hover:bg-primary/10 group transition-all duration-200",
              (signOutState.isLoading || isPendingAction) && "opacity-75"
            )}
            disabled={signOutState.isLoading || isPendingAction}
            aria-label="תפריט משתמש - פתח אפשרויות חשבון"
            aria-expanded="false"
            aria-haspopup="menu"
          >
            <Avatar className="h-9 w-9 transition-all group-hover:scale-105">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || "משתמש"}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {/* Loading overlay */}
            {(signOutState.isLoading || isPendingAction) && (
              <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                <span className="sr-only">טוען פעולה...</span>
              </div>
            )}
            
            {/* Online indicator */}
            <div className={cn(
              "absolute bottom-0 end-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background transition-opacity duration-200",
              (signOutState.isLoading || isPendingAction) && "opacity-50"
            )} aria-label="מחובר" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64 p-2" role="menu">
          <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg mb-2" role="banner">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || "משתמש"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {session.user?.name || "משתמש"}
                </p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {session.user?.email}
                </p>
                <Badge variant="secondary" className="text-xs px-2 py-0" role="status" aria-label="סטטוס חשבון: משתמש פרו">
                  <Sparkles className="me-1 h-3 w-3" aria-hidden="true" />
                  משתמש פרו
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            asChild 
            className={cn(
              "cursor-pointer p-3 hover:bg-primary/5 transition-colors duration-200",
              (signOutState.isLoading || isPendingAction) && "opacity-50 pointer-events-none"
            )}
            role="menuitem"
          >
            <Link href="/profile" className="flex items-center gap-3" aria-label="עבור לדף הפרופיל האישי">
              <User className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>הפרופיל שלי</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            asChild 
            className={cn(
              "cursor-pointer p-3 hover:bg-primary/5 transition-colors duration-200",
              (signOutState.isLoading || isPendingAction) && "opacity-50 pointer-events-none"
            )}
            role="menuitem"
          >
            <Link href="/settings" className="flex items-center gap-3" aria-label="עבור לדף הגדרות החשבון">
              <Settings className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>הגדרות</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            asChild 
            className={cn(
              "cursor-pointer p-3 hover:bg-primary/5 transition-colors duration-200",
              (signOutState.isLoading || isPendingAction) && "opacity-50 pointer-events-none"
            )}
            role="menuitem"
          >
            <Link href="/help" className="flex items-center gap-3" aria-label="עבור לדף עזרה ותמיכה">
              <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>עזרה ותמיכה</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            onClick={handleSignOut} 
            disabled={signOutState.isLoading || isPendingAction}
            className={cn(
              "cursor-pointer p-3 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors duration-200 relative",
              (signOutState.isLoading || isPendingAction) && "opacity-75"
            )}
            role="menuitem"
            aria-label="התנתקות מהחשבון"
            aria-describedby={(signOutState.isLoading || isPendingAction) ? "signout-status" : undefined}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                {(signOutState.isLoading || isPendingAction) ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <span>
                {(signOutState.isLoading || isPendingAction) ? "מתנתק..." : "התנתקות"}
              </span>
              {(signOutState.isLoading || isPendingAction) && (
                <span id="signout-status" className="sr-only">
                  מבצע התנתקות...
                </span>
              )}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
        
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {(signOutState.isLoading || isPendingAction) && "מתנתק..."}
          {signOutState.error && `שגיאה בהתנתקות: ${signOutState.error}`}
        </div>
      </DropdownMenu>
    </>
  );
});