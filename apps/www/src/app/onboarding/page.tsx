"use client";

import { useSession } from "@/lib/auth-client";
import { OnboardingFlow } from "@/components/auth/onboarding-flow";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleOnboardingComplete = () => {
    // You can save the onboarding completion status to the user's profile here
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-2xl shadow-xl" role="status" aria-label="טוען תהליך החדרה">
          <CardHeader className="space-y-4">
            <Skeleton className="w-full h-2 rounded-full" />
            <div className="flex justify-center">
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6 text-center">
              <Skeleton className="w-16 h-16 rounded-2xl mx-auto" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mx-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
          
          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite">
            טוען תהליך החדרה...
          </div>
        </Card>
      </div>
    );
  }

  if (!session) {
    // Redirect to auth page if not logged in
    router.push("/auth");
    return null;
  }

  return (
    <OnboardingFlow
      user={{
        name: session.user?.name || undefined,
        email: session.user?.email || undefined,
      }}
      onComplete={handleOnboardingComplete}
    />
  );
}