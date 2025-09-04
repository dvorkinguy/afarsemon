import { useState, useCallback } from 'react';

interface UseN8NOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useN8N(options?: UseN8NOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/n8n/workflows');
      if (!response.ok) throw new Error('Failed to fetch workflows');
      
      const result = await response.json();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const executeWorkflow = useCallback(async (workflowId: string, inputData?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/n8n/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowId, data: inputData }),
      });
      
      if (!response.ok) throw new Error('Failed to execute workflow');
      
      const result = await response.json();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const triggerWebhook = useCallback(async (webhookPath: string, data: any, isTest = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/n8n/webhook?path=${webhookPath}&test=${isTest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to trigger webhook');
      
      const result = await response.json();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    loading,
    error,
    data,
    fetchWorkflows,
    executeWorkflow,
    triggerWebhook,
  };
}