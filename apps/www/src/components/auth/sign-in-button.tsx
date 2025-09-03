"use client";

import React from "react";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, Eye, EyeOff } from "lucide-react";

export const SignInButton = React.memo(function SignInButton() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const handleGoogleSignIn = React.useCallback(async () => {
    try {
      console.log('Attempting to sign in with Google...');
      setIsLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('שגיאה בהתחברות עם Google: ' + (error instanceof Error ? error.message : 'שגיאה לא מוכרת'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEmailSignIn = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('נא למלא את כל השדות');
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error('Email sign-in error:', error);
      alert('שגיאה בהתחברות: ' + (error instanceof Error ? error.message : 'אימייל או סיסמה שגויים'));
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const handleEmailSignUp = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert('נא למלא את כל השדות');
      return;
    }
    
    try {
      setIsLoading(true);
      await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error('Email sign-up error:', error);
      alert('שגיאה בהרשמה: ' + (error instanceof Error ? error.message : 'שגיאה לא מוכרת'));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, name]);

  if (isPending) {
    return <Button disabled aria-label="טוען...">טוען...</Button>;
  }

  if (session) {
    return null;
  }

  if (!showForm) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label="התחבר עם Google"
        >
          <span lang="he">{isLoading ? 'מתחבר...' : 'התחברות עם Google'}</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          aria-label="התחבר עם אימייל"
        >
          <Mail className="mr-2 h-4 w-4" />
          <span lang="he">התחברות עם אימייל</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle lang="he">התחברות למערכת</CardTitle>
        <CardDescription lang="he">
          התחבר עם Google או צור חשבון חדש עם אימייל
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
            aria-label="התחבר עם Google"
          >
            <span lang="he">{isLoading ? 'מתחבר...' : 'המשך עם Google'}</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground" lang="he">
                או
              </span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" lang="he">התחברות</TabsTrigger>
              <TabsTrigger value="signup" lang="he">הרשמה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" lang="he">אימייל</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" lang="he">סיסמה</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  <span lang="he">{isLoading ? 'מתחבר...' : 'התחבר'}</span>
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" lang="he">שם מלא</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="השם שלך"
                    required
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" lang="he">אימייל</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" lang="he">סיסמה</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  <span lang="he">{isLoading ? 'נרשם...' : 'הרשמה'}</span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <Button
            variant="ghost"
            onClick={() => setShowForm(false)}
            className="w-full"
            aria-label="חזור"
          >
            <span lang="he">חזור</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
