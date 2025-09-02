"use client";

import React from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const SignInButton = React.memo(function SignInButton() {
  const { data: session, isPending } = useSession();

  const handleSignIn = React.useCallback(async () => {
    try {
      console.log('Attempting to sign in with Google...');
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('שגיאה בהתחברות: ' + (error instanceof Error ? error.message : 'שגיאה לא מוכרת'));
    }
  }, []);

  if (isPending) {
    return <Button disabled aria-label="טוען...">טוען...</Button>;
  }

  if (session) {
    return null;
  }

  return (
    <Button
      onClick={handleSignIn}
      aria-label="התחבר עם Google"
    >
      <span lang="he">התחברות</span>
    </Button>
  );
});
