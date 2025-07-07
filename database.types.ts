export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookmark: {
        Row: {
          bookmark_id: number
          category_id: number | null
          created_at: string
          is_favorite: boolean
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          bookmark_id?: never
          category_id?: number | null
          created_at?: string
          is_favorite?: boolean
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          bookmark_id?: never
          category_id?: number | null
          created_at?: string
          is_favorite?: boolean
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      category: {
        Row: {
          category_id: number
          category_name: string
          content_type_id: number | null
          created_at: string
          is_default: boolean
          level: number | null
          parent_category_id: number | null
          sort_order: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: never
          category_name: string
          content_type_id?: number | null
          created_at?: string
          is_default?: boolean
          level?: number | null
          parent_category_id?: number | null
          sort_order?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: never
          category_name?: string
          content_type_id?: number | null
          created_at?: string
          is_default?: boolean
          level?: number | null
          parent_category_id?: number | null
          sort_order?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_content_type_id_content_type_content_type_id_fk"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_type"
            referencedColumns: ["content_type_id"]
          },
        ]
      }
      content_type: {
        Row: {
          content_type_code: Database["public"]["Enums"]["content_type_codes"]
          content_type_id: number
          content_type_name: string
          createdAt: string
          description: string | null
          updatedAt: string
        }
        Insert: {
          content_type_code: Database["public"]["Enums"]["content_type_codes"]
          content_type_id?: never
          content_type_name: string
          createdAt?: string
          description?: string | null
          updatedAt?: string
        }
        Update: {
          content_type_code?: Database["public"]["Enums"]["content_type_codes"]
          content_type_id?: never
          content_type_name?: string
          createdAt?: string
          description?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      memo: {
        Row: {
          content: string | null
          content_type_id: number | null
          created_at: string
          is_pinned: boolean
          memo_id: number
          position: number | null
          summary: string | null
          target_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          content_type_id?: number | null
          created_at?: string
          is_pinned?: boolean
          memo_id?: never
          position?: number | null
          summary?: string | null
          target_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          content_type_id?: number | null
          created_at?: string
          is_pinned?: boolean
          memo_id?: never
          position?: number | null
          summary?: string | null
          target_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memo_content_type_id_content_type_content_type_id_fk"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_type"
            referencedColumns: ["content_type_id"]
          },
        ]
      }
      payments: {
        Row: {
          approved_at: string
          created_at: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id: number
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at: string
          created_at?: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id?: never
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string
          created_at?: string
          metadata?: Json
          order_id?: string
          order_name?: string
          payment_id?: never
          payment_key?: string
          raw_data?: Json
          receipt_url?: string
          requested_at?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          marketing_consent: boolean
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tag: {
        Row: {
          created_at: string
          tag_id: number
          tag_name: string
          updated_at: string
          usage_count: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          tag_id?: never
          tag_name: string
          updated_at?: string
          usage_count?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          tag_id?: never
          tag_name?: string
          updated_at?: string
          usage_count?: number
          user_id?: string | null
        }
        Relationships: []
      }
      taggable: {
        Row: {
          content_type_id: number
          tag_id: number
          target_id: number
        }
        Insert: {
          content_type_id: number
          tag_id: number
          target_id: number
        }
        Update: {
          content_type_id?: number
          tag_id?: number
          target_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "taggable_content_type_id_content_type_content_type_id_fk"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_type"
            referencedColumns: ["content_type_id"]
          },
          {
            foreignKeyName: "taggable_tag_id_tag_tag_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["tag_id"]
          },
          {
            foreignKeyName: "taggable_tag_id_tag_tag_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag_content_view"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      ui_type: {
        Row: {
          createdAt: string
          description: string | null
          ui_type_code: Database["public"]["Enums"]["ui_type_codes"]
          ui_type_id: number
          ui_type_name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          ui_type_code: Database["public"]["Enums"]["ui_type_codes"]
          ui_type_id?: never
          ui_type_name: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          ui_type_code?: Database["public"]["Enums"]["ui_type_codes"]
          ui_type_id?: never
          ui_type_name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      ui_view: {
        Row: {
          category_id: number | null
          content_type_id: number | null
          created_at: string
          is_active: boolean
          name: string
          sort_order: number | null
          ui_type_id: number | null
          ui_view_id: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: number | null
          content_type_id?: number | null
          created_at?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
          ui_type_id?: number | null
          ui_view_id?: never
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: number | null
          content_type_id?: number | null
          created_at?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
          ui_type_id?: number | null
          ui_view_id?: never
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_view_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "ui_view_content_type_id_content_type_content_type_id_fk"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_type"
            referencedColumns: ["content_type_id"]
          },
          {
            foreignKeyName: "ui_view_ui_type_id_ui_type_ui_type_id_fk"
            columns: ["ui_type_id"]
            isOneToOne: false
            referencedRelation: "ui_type"
            referencedColumns: ["ui_type_id"]
          },
        ]
      }
      ui_view_content: {
        Row: {
          target_id: number
          ui_view_id: number
        }
        Insert: {
          target_id: number
          ui_view_id: number
        }
        Update: {
          target_id?: number
          ui_view_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ui_view_content_ui_view_id_ui_view_ui_view_id_fk"
            columns: ["ui_view_id"]
            isOneToOne: false
            referencedRelation: "ui_view"
            referencedColumns: ["ui_view_id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type_codes"]
          content_type_id: number | null
          created_at: string
          last_at: string | null
          metadata: Json | null
          target_id: number | null
          updated_at: string
          user_activity_id: number
          user_id: string | null
          value: number | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type_codes"]
          content_type_id?: number | null
          created_at?: string
          last_at?: string | null
          metadata?: Json | null
          target_id?: number | null
          updated_at?: string
          user_activity_id?: never
          user_id?: string | null
          value?: number | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type_codes"]
          content_type_id?: number | null
          created_at?: string
          last_at?: string | null
          metadata?: Json | null
          target_id?: number | null
          updated_at?: string
          user_activity_id?: never
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_content_type_id_content_type_content_type_id_fk"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "content_type"
            referencedColumns: ["content_type_id"]
          },
        ]
      }
    }
    Views: {
      bookmark_view: {
        Row: {
          bookmark_id: number | null
          category_id: number | null
          click_count: number | null
          created_at: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          bookmark_id?: number | null
          category_id?: number | null
          click_count?: never
          created_at?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          bookmark_id?: number | null
          category_id?: number | null
          click_count?: never
          created_at?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      content_view: {
        Row: {
          category_id: number | null
          content_type_id: number | null
          created_at: string | null
          memo: string | null
          memo_id: number | null
          target_id: number | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string | null
          use_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      memo_content_view: {
        Row: {
          category_id: number | null
          content_type_id: number | null
          created_at: string | null
          is_pinned: boolean | null
          memo: string | null
          memo_id: number | null
          position: number | null
          summary: string | null
          target_id: number | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      tag_content_view: {
        Row: {
          category_id: number | null
          content_type_id: number | null
          created_at: string | null
          memo: string | null
          tag_id: number | null
          tag_name: string | null
          target_id: number | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string | null
          use_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_category_id_category_category_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
    }
    Functions: {
      get_max_category_sort_order: {
        Args: { user_id: string; parent_id: number }
        Returns: number
      }
    }
    Enums: {
      activity_type_codes:
        | "click"
        | "view"
        | "edit"
        | "delete"
        | "create"
        | "share"
        | "export"
        | "import"
      content_type_codes: "all" | "bookmark" | "book" | "movie" | "travel"
      ui_type_codes:
        | "default"
        | "list"
        | "card"
        | "grid"
        | "timeline"
        | "table"
        | "calendar"
        | "map"
        | "chart"
        | "gallery"
        | "tab"
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
      activity_type_codes: [
        "click",
        "view",
        "edit",
        "delete",
        "create",
        "share",
        "export",
        "import",
      ],
      content_type_codes: ["all", "bookmark", "book", "movie", "travel"],
      ui_type_codes: [
        "default",
        "list",
        "card",
        "grid",
        "timeline",
        "table",
        "calendar",
        "map",
        "chart",
        "gallery",
        "tab",
      ],
    },
  },
} as const
