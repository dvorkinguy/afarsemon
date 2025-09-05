import { NextResponse } from 'next/server';
import { n8n } from '@/lib/n8n';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const webhookPath = url.searchParams.get('path');
    
    if (!webhookPath) {
      return NextResponse.json(
        { error: 'Webhook path is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const isTest = url.searchParams.get('test') === 'true';
    
    const result = await n8n.triggerWebhook(webhookPath, data, isTest);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return NextResponse.json(
      { error: 'Failed to trigger webhook' },
      { status: 500 }
    );
  }
}