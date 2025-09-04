interface N8NConfig {
  apiUrl: string;
  apiKey: string;
  webhookUrl: string;
  webhookTestUrl: string;
}

class N8NClient {
  private config: N8NConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.N8N_API_URL || '',
      apiKey: process.env.N8N_API_KEY || '',
      webhookUrl: process.env.N8N_WEBHOOK_URL || '',
      webhookTestUrl: process.env.N8N_WEBHOOK_TEST_URL || ''
    };
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.config.apiKey
    };
  }

  async getWorkflows() {
    const response = await fetch(`${this.config.apiUrl}/workflows`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getWorkflow(id: string) {
    const response = await fetch(`${this.config.apiUrl}/workflows/${id}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async executeWorkflow(id: string, data?: any) {
    const response = await fetch(`${this.config.apiUrl}/workflows/${id}/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async activateWorkflow(id: string) {
    const response = await fetch(`${this.config.apiUrl}/workflows/${id}/activate`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return response.json();
  }

  async deactivateWorkflow(id: string) {
    const response = await fetch(`${this.config.apiUrl}/workflows/${id}/deactivate`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return response.json();
  }

  async triggerWebhook(webhookPath: string, data: any, isTest = false) {
    const baseUrl = isTest ? this.config.webhookTestUrl : this.config.webhookUrl;
    const response = await fetch(`${baseUrl}/${webhookPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getExecutions(workflowId?: string) {
    const url = workflowId 
      ? `${this.config.apiUrl}/executions?workflowId=${workflowId}`
      : `${this.config.apiUrl}/executions`;
    
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getExecution(id: string) {
    const response = await fetch(`${this.config.apiUrl}/executions/${id}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }
}

export const n8n = new N8NClient();