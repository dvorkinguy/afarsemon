"use client";

import React from 'react';
import { useSession, getSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AuthDebugPage() {
  const { data: session, isPending, error } = useSession();
  const [manualSessionData, setManualSessionData] = React.useState<unknown>(null);
  const [manualSessionError, setManualSessionError] = React.useState<unknown>(null);
  const [isManualLoading, setIsManualLoading] = React.useState(false);
  const [clientUrl, setClientUrl] = React.useState<string>('');
  const [isClientSide, setIsClientSide] = React.useState(false);

  const fetchSessionManually = async () => {
    setIsManualLoading(true);
    setManualSessionError(null);
    try {
      const result = await getSession();
      setManualSessionData(result);
    } catch (err) {
      setManualSessionError(err);
      console.error('Manual session fetch error:', err);
    } finally {
      setIsManualLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch('/api/auth/session');
      console.log('Auth endpoint response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Auth endpoint data:', data);
      } else {
        const text = await response.text();
        console.error('Auth endpoint error response:', text);
      }
    } catch (err) {
      console.error('Auth endpoint fetch error:', err);
    }
  };

  React.useEffect(() => {
    // Set client-side values after mount to avoid hydration mismatch
    setIsClientSide(true);
    setClientUrl(window.location.origin);
    
    // Test auth endpoint on load
    testAuthEndpoint();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Better Auth Debug Panel
            </CardTitle>
            <CardDescription>
              Debug information for Better Auth session initialization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* useSession Hook Status */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                useSession Hook Status
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isPending && !error && <CheckCircle className="h-4 w-4 text-green-500" />}
                {error && <AlertCircle className="h-4 w-4 text-red-500" />}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status:</label>
                  <Badge variant={isPending ? "secondary" : error ? "destructive" : "default"}>
                    {isPending ? "Loading..." : error ? "Error" : "Ready"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Has Session:</label>
                  <Badge variant={session ? "default" : "secondary"}>
                    {session ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Error:</label>
                  <Badge variant={error ? "destructive" : "secondary"}>
                    {error ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>useSession Error:</strong><br />
                    {error instanceof Error ? error.message : JSON.stringify(error)}
                  </AlertDescription>
                </Alert>
              )}

              {session && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Session Data:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Manual Session Fetch */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Manual Session Fetch</h3>
              <div className="flex gap-2">
                <Button onClick={fetchSessionManually} disabled={isManualLoading}>
                  {isManualLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fetch Session Manually
                </Button>
              </div>

              {!!manualSessionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Manual Fetch Error:</strong><br />
                    {(manualSessionError as Error)?.message || JSON.stringify(manualSessionError)}
                  </AlertDescription>
                </Alert>
              )}

              {!!manualSessionData && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Manual Session Data:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(manualSessionData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Environment Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Environment Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>NEXT_PUBLIC_BETTER_AUTH_URL:</strong><br />
                  <code className={!isClientSide ? "opacity-50" : ""}>
                    {isClientSide 
                      ? (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'Not set')
                      : 'Loading...'
                    }
                  </code>
                </div>
                <div>
                  <strong>NEXT_PUBLIC_APP_URL:</strong><br />
                  <code className={!isClientSide ? "opacity-50" : ""}>
                    {isClientSide 
                      ? (process.env.NEXT_PUBLIC_APP_URL || 'Not set')
                      : 'Loading...'
                    }
                  </code>
                </div>
                <div>
                  <strong>NODE_ENV:</strong><br />
                  <code className={!isClientSide ? "opacity-50" : ""}>
                    {isClientSide 
                      ? process.env.NODE_ENV
                      : 'Loading...'
                    }
                  </code>
                </div>
                <div>
                  <strong>Current URL:</strong><br />
                  <code className={!isClientSide ? "opacity-50" : ""}>
                    {isClientSide ? clientUrl : 'Loading...'}
                  </code>
                </div>
              </div>
            </div>

            {/* Auth API Tests */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Auth API Tests</h3>
              <div className="flex gap-2">
                <Button onClick={testAuthEndpoint} variant="outline">
                  Test /api/auth/session
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Check browser console for detailed API test results
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}