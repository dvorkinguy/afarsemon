/**
 * Database types for Afarsemon AI Automation Platform
 * Supporting Hebrew-first content for Israeli SMBs
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // User profiles with organization support
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          company_size: string | null
          industry: string | null
          phone: string | null
          preferred_language: 'he' | 'en'
          role: 'admin' | 'user' | 'viewer'
          onboarding_completed: boolean
          metadata: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          phone?: string | null
          preferred_language?: 'he' | 'en'
          role?: 'admin' | 'user' | 'viewer'
          onboarding_completed?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          phone?: string | null
          preferred_language?: 'he' | 'en'
          role?: 'admin' | 'user' | 'viewer'
          onboarding_completed?: boolean
          metadata?: Json | null
        }
      }

      // Organizations for multi-tenant support
      organizations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          name_he: string | null
          slug: string
          owner_id: string
          logo_url: string | null
          website: string | null
          description: string | null
          description_he: string | null
          industry: string | null
          size: string | null
          settings: Json | null
          subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status: 'active' | 'past_due' | 'canceled' | 'trial'
          trial_ends_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          name_he?: string | null
          slug: string
          owner_id: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          description_he?: string | null
          industry?: string | null
          size?: string | null
          settings?: Json | null
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trial'
          trial_ends_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          name_he?: string | null
          slug?: string
          owner_id?: string
          logo_url?: string | null
          website?: string | null
          description?: string | null
          description_he?: string | null
          industry?: string | null
          size?: string | null
          settings?: Json | null
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'trial'
          trial_ends_at?: string | null
        }
      }

      // Organization members
      organization_members: {
        Row: {
          id: string
          created_at: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string | null
        }
      }

      // AI Automation Demos
      automation_demos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          title_he: string
          description: string
          description_he: string
          category: 'sales' | 'marketing' | 'customer_service' | 'operations' | 'hr' | 'finance' | 'other'
          demo_type: 'interactive' | 'video' | 'live_integration'
          thumbnail_url: string | null
          video_url: string | null
          demo_config: Json
          tags: string[]
          wow_factor: number // 1-10 scale
          complexity: 'simple' | 'intermediate' | 'advanced'
          estimated_time_savings: string | null
          roi_percentage: number | null
          is_featured: boolean
          is_active: boolean
          view_count: number
          interaction_count: number
          average_rating: number | null
          industry_specific: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          title_he: string
          description: string
          description_he: string
          category: 'sales' | 'marketing' | 'customer_service' | 'operations' | 'hr' | 'finance' | 'other'
          demo_type: 'interactive' | 'video' | 'live_integration'
          thumbnail_url?: string | null
          video_url?: string | null
          demo_config: Json
          tags?: string[]
          wow_factor?: number
          complexity?: 'simple' | 'intermediate' | 'advanced'
          estimated_time_savings?: string | null
          roi_percentage?: number | null
          is_featured?: boolean
          is_active?: boolean
          view_count?: number
          interaction_count?: number
          average_rating?: number | null
          industry_specific?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          title_he?: string
          description?: string
          description_he?: string
          category?: 'sales' | 'marketing' | 'customer_service' | 'operations' | 'hr' | 'finance' | 'other'
          demo_type?: 'interactive' | 'video' | 'live_integration'
          thumbnail_url?: string | null
          video_url?: string | null
          demo_config?: Json
          tags?: string[]
          wow_factor?: number
          complexity?: 'simple' | 'intermediate' | 'advanced'
          estimated_time_savings?: string | null
          roi_percentage?: number | null
          is_featured?: boolean
          is_active?: boolean
          view_count?: number
          interaction_count?: number
          average_rating?: number | null
          industry_specific?: string[] | null
        }
      }

      // Automation Templates
      automation_templates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          name_he: string
          description: string
          description_he: string
          category: string
          platform: 'n8n' | 'make' | 'zapier' | 'custom'
          template_data: Json
          required_integrations: string[]
          estimated_setup_time: number // in minutes
          difficulty_level: 'beginner' | 'intermediate' | 'expert'
          use_cases: string[]
          use_cases_he: string[]
          preview_image_url: string | null
          documentation_url: string | null
          is_public: boolean
          is_featured: boolean
          usage_count: number
          author_id: string | null
          organization_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          name_he: string
          description: string
          description_he: string
          category: string
          platform: 'n8n' | 'make' | 'zapier' | 'custom'
          template_data: Json
          required_integrations?: string[]
          estimated_setup_time?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'expert'
          use_cases?: string[]
          use_cases_he?: string[]
          preview_image_url?: string | null
          documentation_url?: string | null
          is_public?: boolean
          is_featured?: boolean
          usage_count?: number
          author_id?: string | null
          organization_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          name_he?: string
          description?: string
          description_he?: string
          category?: string
          platform?: 'n8n' | 'make' | 'zapier' | 'custom'
          template_data?: Json
          required_integrations?: string[]
          estimated_setup_time?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'expert'
          use_cases?: string[]
          use_cases_he?: string[]
          preview_image_url?: string | null
          documentation_url?: string | null
          is_public?: boolean
          is_featured?: boolean
          usage_count?: number
          author_id?: string | null
          organization_id?: string | null
        }
      }

      // Webhook Configurations
      webhook_configs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          organization_id: string
          name: string
          description: string | null
          endpoint_url: string
          secret_key: string
          platform: 'n8n' | 'make' | 'zapier' | 'custom'
          events: string[]
          headers: Json | null
          is_active: boolean
          last_triggered_at: string | null
          trigger_count: number
          error_count: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          organization_id: string
          name: string
          description?: string | null
          endpoint_url: string
          secret_key: string
          platform: 'n8n' | 'make' | 'zapier' | 'custom'
          events?: string[]
          headers?: Json | null
          is_active?: boolean
          last_triggered_at?: string | null
          trigger_count?: number
          error_count?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          organization_id?: string
          name?: string
          description?: string | null
          endpoint_url?: string
          secret_key?: string
          platform?: 'n8n' | 'make' | 'zapier' | 'custom'
          events?: string[]
          headers?: Json | null
          is_active?: boolean
          last_triggered_at?: string | null
          trigger_count?: number
          error_count?: number
          metadata?: Json | null
        }
      }

      // Webhook Logs
      webhook_logs: {
        Row: {
          id: string
          created_at: string
          webhook_config_id: string
          event_type: string
          payload: Json
          response_status: number | null
          response_body: Json | null
          error_message: string | null
          execution_time_ms: number | null
          retry_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          webhook_config_id: string
          event_type: string
          payload: Json
          response_status?: number | null
          response_body?: Json | null
          error_message?: string | null
          execution_time_ms?: number | null
          retry_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          webhook_config_id?: string
          event_type?: string
          payload?: Json
          response_status?: number | null
          response_body?: Json | null
          error_message?: string | null
          execution_time_ms?: number | null
          retry_count?: number
        }
      }

      // Usage Analytics
      usage_analytics: {
        Row: {
          id: string
          created_at: string
          organization_id: string
          user_id: string | null
          event_type: string
          event_category: string
          event_data: Json | null
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          organization_id: string
          user_id?: string | null
          event_type: string
          event_category: string
          event_data?: Json | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          organization_id?: string
          user_id?: string | null
          event_type?: string
          event_category?: string
          event_data?: Json | null
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
      }

      // Demo Interactions
      demo_interactions: {
        Row: {
          id: string
          created_at: string
          demo_id: string
          user_id: string | null
          organization_id: string | null
          interaction_type: 'view' | 'play' | 'complete' | 'share' | 'save'
          interaction_data: Json | null
          session_id: string | null
          rating: number | null
          feedback: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          demo_id: string
          user_id?: string | null
          organization_id?: string | null
          interaction_type: 'view' | 'play' | 'complete' | 'share' | 'save'
          interaction_data?: Json | null
          session_id?: string | null
          rating?: number | null
          feedback?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          demo_id?: string
          user_id?: string | null
          organization_id?: string | null
          interaction_type?: 'view' | 'play' | 'complete' | 'share' | 'save'
          interaction_data?: Json | null
          session_id?: string | null
          rating?: number | null
          feedback?: string | null
        }
      }

      // AI Chat Sessions
      ai_chat_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          organization_id: string | null
          session_title: string | null
          context: Json | null
          model: string
          total_tokens: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          organization_id?: string | null
          session_title?: string | null
          context?: Json | null
          model?: string
          total_tokens?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          organization_id?: string | null
          session_title?: string | null
          context?: Json | null
          model?: string
          total_tokens?: number
          is_active?: boolean
        }
      }

      // AI Chat Messages
      ai_chat_messages: {
        Row: {
          id: string
          created_at: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          tokens_used?: number | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]