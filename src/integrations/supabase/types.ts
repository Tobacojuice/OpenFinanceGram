export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor: string
          created_at: string
          detail: Json
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          actor: string
          created_at?: string
          detail: Json
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          detail?: Json
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      backtests: {
        Row: {
          created_at: string
          equity: Json
          id: string
          params: Json
          strategy: string
          summary: Json
          symbol: string
          trades: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          equity: Json
          id?: string
          params: Json
          strategy: string
          summary: Json
          symbol: string
          trades: Json
          user_id: string
        }
        Update: {
          created_at?: string
          equity?: Json
          id?: string
          params?: Json
          strategy?: string
          summary?: Json
          symbol?: string
          trades?: Json
          user_id?: string
        }
        Relationships: []
      }
      bank_reports: {
        Row: {
          analysis: Json
          bank_name: string
          created_at: string
          id: string
          key_insights: string[]
          report_quarter: string | null
          report_title: string
          report_type: string
          report_url: string
          report_year: number
          updated_at: string
        }
        Insert: {
          analysis: Json
          bank_name: string
          created_at?: string
          id?: string
          key_insights: string[]
          report_quarter?: string | null
          report_title: string
          report_type: string
          report_url: string
          report_year: number
          updated_at?: string
        }
        Update: {
          analysis?: Json
          bank_name?: string
          created_at?: string
          id?: string
          key_insights?: string[]
          report_quarter?: string | null
          report_title?: string
          report_type?: string
          report_url?: string
          report_year?: number
          updated_at?: string
        }
        Relationships: []
      }
      channel_members: {
        Row: {
          channel_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          member_count: number | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          member_count?: number | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cv_templates: {
        Row: {
          ats_score: number | null
          company: string | null
          created_at: string | null
          html_template: string
          id: string
          industry: string
          is_active: boolean | null
          name: string
          scraped_url: string | null
          sections: Json
        }
        Insert: {
          ats_score?: number | null
          company?: string | null
          created_at?: string | null
          html_template?: string
          id: string
          industry: string
          is_active?: boolean | null
          name: string
          scraped_url?: string | null
          sections?: Json
        }
        Update: {
          ats_score?: number | null
          company?: string | null
          created_at?: string | null
          html_template?: string
          id?: string
          industry?: string
          is_active?: boolean | null
          name?: string
          scraped_url?: string | null
          sections?: Json
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          applied_at: string | null
          company: string
          created_at: string | null
          id: string
          job_title: string
          job_url: string | null
          location: string | null
          match_score: number | null
          metadata: Json | null
          source: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company: string
          created_at?: string | null
          id?: string
          job_title: string
          job_url?: string | null
          location?: string | null
          match_score?: number | null
          metadata?: Json | null
          source?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company?: string
          created_at?: string | null
          id?: string
          job_title?: string
          job_url?: string | null
          location?: string | null
          match_score?: number | null
          metadata?: Json | null
          source?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      jobsea_cert_progress: {
        Row: {
          certificate: string
          created_at: string
          exam_date: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate: string
          created_at?: string
          exam_date?: string | null
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate?: string
          created_at?: string
          exam_date?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobsea_companies: {
        Row: {
          added_by: string[] | null
          created_at: string
          description: string | null
          geography: string
          glassdoor_rating: number | null
          headcount: number
          hiring_velocity: number
          id: string
          linkedin_url: string
          logo: string | null
          mission: string | null
          name: string
          open_jobs: number
          preferred_profile: string | null
          salary_range: string | null
          sector: string
          updated_at: string
          values: string[] | null
        }
        Insert: {
          added_by?: string[] | null
          created_at?: string
          description?: string | null
          geography: string
          glassdoor_rating?: number | null
          headcount: number
          hiring_velocity: number
          id?: string
          linkedin_url: string
          logo?: string | null
          mission?: string | null
          name: string
          open_jobs: number
          preferred_profile?: string | null
          salary_range?: string | null
          sector: string
          updated_at?: string
          values?: string[] | null
        }
        Update: {
          added_by?: string[] | null
          created_at?: string
          description?: string | null
          geography?: string
          glassdoor_rating?: number | null
          headcount?: number
          hiring_velocity?: number
          id?: string
          linkedin_url?: string
          logo?: string | null
          mission?: string | null
          name?: string
          open_jobs?: number
          preferred_profile?: string | null
          salary_range?: string | null
          sector?: string
          updated_at?: string
          values?: string[] | null
        }
        Relationships: []
      }
      jobsea_cvs: {
        Row: {
          ats_score: number | null
          created_at: string
          id: string
          payload: Json
          s3_key: string | null
          template: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string
          id?: string
          payload: Json
          s3_key?: string | null
          template: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string
          id?: string
          payload?: Json
          s3_key?: string | null
          template?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobsea_linkedin_profiles: {
        Row: {
          certifications: Json | null
          connections_count: number | null
          created_at: string | null
          education: Json | null
          experience: Json | null
          first_name: string | null
          followers_count: number | null
          headline: string | null
          id: string
          last_name: string | null
          linkedin_url: string
          location: string | null
          profile_image_url: string | null
          public_identifier: string | null
          scraped_at: string | null
          skills: Json | null
          summary: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certifications?: Json | null
          connections_count?: number | null
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          first_name?: string | null
          followers_count?: number | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url: string
          location?: string | null
          profile_image_url?: string | null
          public_identifier?: string | null
          scraped_at?: string | null
          skills?: Json | null
          summary?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certifications?: Json | null
          connections_count?: number | null
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          first_name?: string | null
          followers_count?: number | null
          headline?: string | null
          id?: string
          last_name?: string | null
          linkedin_url?: string
          location?: string | null
          profile_image_url?: string | null
          public_identifier?: string | null
          scraped_at?: string | null
          skills?: Json | null
          summary?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      jobsea_linkedin_scrapes: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          linkedin_url: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          linkedin_url: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          linkedin_url?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      jobsea_notifications: {
        Row: {
          created_at: string
          engagement_stats: Json | null
          id: string
          is_read: boolean
          post_content: string
          post_url: string
          sentiment: string | null
          user_id: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          engagement_stats?: Json | null
          id?: string
          is_read?: boolean
          post_content: string
          post_url: string
          sentiment?: string | null
          user_id: string
          voice_id: string
        }
        Update: {
          created_at?: string
          engagement_stats?: Json | null
          id?: string
          is_read?: boolean
          post_content?: string
          post_url?: string
          sentiment?: string | null
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobsea_notifications_voice_id_fkey"
            columns: ["voice_id"]
            isOneToOne: false
            referencedRelation: "jobsea_voices"
            referencedColumns: ["id"]
          },
        ]
      }
      jobsea_profiles: {
        Row: {
          branches: string[]
          career_stage: string | null
          certifications: string[] | null
          created_at: string
          dream_job: string
          education: string | null
          experience_level: string | null
          financial_goals: string | null
          geography: string
          id: string
          linkedin_connected: boolean | null
          linkedin_url: string | null
          realistic_job: string
          skills: string[] | null
          updated_at: string
          user_id: string
          work_experience: string | null
          worst_job: string
        }
        Insert: {
          branches: string[]
          career_stage?: string | null
          certifications?: string[] | null
          created_at?: string
          dream_job: string
          education?: string | null
          experience_level?: string | null
          financial_goals?: string | null
          geography: string
          id?: string
          linkedin_connected?: boolean | null
          linkedin_url?: string | null
          realistic_job: string
          skills?: string[] | null
          updated_at?: string
          user_id: string
          work_experience?: string | null
          worst_job: string
        }
        Update: {
          branches?: string[]
          career_stage?: string | null
          certifications?: string[] | null
          created_at?: string
          dream_job?: string
          education?: string | null
          experience_level?: string | null
          financial_goals?: string | null
          geography?: string
          id?: string
          linkedin_connected?: boolean | null
          linkedin_url?: string | null
          realistic_job?: string
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          work_experience?: string | null
          worst_job?: string
        }
        Relationships: []
      }
      jobsea_user_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobsea_user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "jobsea_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      jobsea_user_voices: {
        Row: {
          created_at: string
          id: string
          user_id: string
          voice_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          voice_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          voice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobsea_user_voices_voice_id_fkey"
            columns: ["voice_id"]
            isOneToOne: false
            referencedRelation: "jobsea_voices"
            referencedColumns: ["id"]
          },
        ]
      }
      jobsea_voices: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string
          content_focus: string | null
          created_at: string
          engagement_30d: number
          followers: number
          id: string
          last_post_at: string | null
          linkedin_id: string
          name: string
          notable_achievements: string | null
          title: string
          updated_at: string
          users: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company: string
          content_focus?: string | null
          created_at?: string
          engagement_30d: number
          followers: number
          id?: string
          last_post_at?: string | null
          linkedin_id: string
          name: string
          notable_achievements?: string | null
          title: string
          updated_at?: string
          users?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string
          content_focus?: string | null
          created_at?: string
          engagement_30d?: number
          followers?: number
          id?: string
          last_post_at?: string | null
          linkedin_id?: string
          name?: string
          notable_achievements?: string | null
          title?: string
          updated_at?: string
          users?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json | null
          channel_id: string | null
          content: string
          created_at: string | null
          edited_at: string | null
          id: string
          reactions: Json | null
          reply_to: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          channel_id?: string | null
          content: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          reactions?: Json | null
          reply_to?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string | null
          content?: string
          created_at?: string | null
          edited_at?: string | null
          id?: string
          reactions?: Json | null
          reply_to?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      news_alerts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          keywords: string[]
          symbols: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords: string[]
          symbols?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[]
          symbols?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      paper_fills: {
        Row: {
          created_at: string
          fee: number
          id: string
          order_id: string
          price: number
          qty: number
          symbol: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fee?: number
          id?: string
          order_id: string
          price: number
          qty: number
          symbol: string
          user_id: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          order_id?: string
          price?: number
          qty?: number
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_fills_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "paper_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_orders: {
        Row: {
          created_at: string
          id: string
          limit_price: number | null
          qty: number
          side: Database["public"]["Enums"]["order_side"]
          signal_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          stop_price: number | null
          strategy: string | null
          symbol: string
          tags: string[] | null
          tp_price: number | null
          type: Database["public"]["Enums"]["order_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          limit_price?: number | null
          qty: number
          side: Database["public"]["Enums"]["order_side"]
          signal_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stop_price?: number | null
          strategy?: string | null
          symbol: string
          tags?: string[] | null
          tp_price?: number | null
          type: Database["public"]["Enums"]["order_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          limit_price?: number | null
          qty?: number
          side?: Database["public"]["Enums"]["order_side"]
          signal_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stop_price?: number | null
          strategy?: string | null
          symbol?: string
          tags?: string[] | null
          tp_price?: number | null
          type?: Database["public"]["Enums"]["order_type"]
          user_id?: string
        }
        Relationships: []
      }
      paper_positions: {
        Row: {
          avg_price: number
          id: string
          qty: number
          realized: number
          symbol: string
          unrealized: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_price: number
          id?: string
          qty?: number
          realized?: number
          symbol: string
          unrealized?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_price?: number
          id?: string
          qty?: number
          realized?: number
          symbol?: string
          unrealized?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          created_at: string
          holdings: Json
          id: string
          snapshot_date: string
          total_gain_loss: number
          total_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          holdings: Json
          id?: string
          snapshot_date: string
          total_gain_loss: number
          total_value: number
          user_id: string
        }
        Update: {
          created_at?: string
          holdings?: Json
          id?: string
          snapshot_date?: string
          total_gain_loss?: number
          total_value?: number
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          condition: string
          created_at: string
          id: string
          is_active: boolean | null
          price: number
          symbol: string
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          condition: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          price: number
          symbol: string
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          condition?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          price?: number
          symbol?: string
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          notifications_enabled: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_screens: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          symbol: string
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          symbol: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          symbol?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategy_signals: {
        Row: {
          created_at: string
          id: string
          interval: string
          payload: Json
          strategy: string
          symbol: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interval: string
          payload: Json
          strategy: string
          symbol: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval?: string
          payload?: Json
          strategy?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          channel_id: string | null
          country: string
          created_at: string | null
          domain: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          region: string
          student_count: number | null
        }
        Insert: {
          channel_id?: string | null
          country: string
          created_at?: string | null
          domain?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          region: string
          student_count?: number | null
        }
        Update: {
          channel_id?: string | null
          country?: string
          created_at?: string | null
          domain?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          region?: string
          student_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "universities_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cvs: {
        Row: {
          ats_score: number
          company_target: string
          content: Json
          created_at: string | null
          id: string
          is_draft: boolean | null
          template_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ats_score?: number
          company_target: string
          content: Json
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          template_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ats_score?: number
          company_target?: string
          content?: Json
          created_at?: string | null
          id?: string
          is_draft?: boolean | null
          template_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_university_platforms: {
        Row: {
          created_at: string | null
          id: string
          is_supported: boolean | null
          platform_url: string
          university_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_supported?: boolean | null
          platform_url: string
          university_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_supported?: boolean | null
          platform_url?: string
          university_name?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlist_items: {
        Row: {
          added_at: string
          id: string
          notes: string | null
          symbol: string
          watchlist_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          notes?: string | null
          symbol: string
          watchlist_id: string
        }
        Update: {
          added_at?: string
          id?: string
          notes?: string | null
          symbol?: string
          watchlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_items_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_job_match_score: {
        Args: {
          p_company: string
          p_job_title: string
          p_location: string
          p_user_branches: string[]
          p_user_geography: string
        }
        Returns: number
      }
      check_linkedin_scrape_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      search_universities: {
        Args: { region_filter?: string; search_term: string }
        Returns: {
          channel_id: string
          country: string
          id: string
          match_score: number
          name: string
          region: string
          student_count: number
        }[]
      }
      user_can_view_channel: {
        Args: { _channel_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      order_side: "buy" | "sell"
      order_status:
        | "new"
        | "filled"
        | "canceled"
        | "rejected"
        | "partially_filled"
      order_type: "market" | "limit" | "stop" | "bracket"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_side: ["buy", "sell"],
      order_status: [
        "new",
        "filled",
        "canceled",
        "rejected",
        "partially_filled",
      ],
      order_type: ["market", "limit", "stop", "bracket"],
    },
  },
} as const
