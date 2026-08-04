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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          name_ar: string
          name_en: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_ar: string
          name_en?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          name_ar?: string
          name_en?: string | null
          slug?: string
        }
        Relationships: []
      }
      client_errors: {
        Row: {
          created_at: string
          id: string
          message: string
          path: string | null
          stack: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          path?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          path?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          amount: number | null
          created_at: string
          full_name: string
          id: string
          message: string | null
          phone: string
          product_id: string
          status: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          product_id: string
          status?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          product_id?: string
          status?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          id: string
          image_url: string | null
          name_ar: string
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          id?: string
          image_url?: string | null
          name_ar: string
          order_id: string
          price: number
          product_id?: string | null
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          id?: string
          image_url?: string | null
          name_ar?: string
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string | null
          full_name: string
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          phone: string
          shipping: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          full_name: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          phone: string
          shipping?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          user_id?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          phone?: string
          shipping?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          badge: string | null
          brand: string | null
          category_id: string | null
          colors: Json | null
          condition: string | null
          created_at: string | null
          description_ar: string | null
          gender: string | null
          id: string
          image_url: string
          images: Json | null
          name_ar: string
          original_price: number | null
          price: number
          rating: number | null
          rentable: boolean
          rental_deposit: number | null
          rental_duration_days: number | null
          rental_price: number | null
          reserved_order_id: string | null
          reserved_until: string | null
          reviews_count: number | null
          sale_price: number | null
          seller_notes: string | null
          sizes: Json | null
          sold: boolean
          stock: number
          verified_clean: boolean
          views_day: string
          views_today: number
          views_total: number
          worn_times: string | null
        }
        Insert: {
          active?: boolean | null
          badge?: string | null
          brand?: string | null
          category_id?: string | null
          colors?: Json | null
          condition?: string | null
          created_at?: string | null
          description_ar?: string | null
          gender?: string | null
          id?: string
          image_url: string
          images?: Json | null
          name_ar: string
          original_price?: number | null
          price: number
          rating?: number | null
          rentable?: boolean
          rental_deposit?: number | null
          rental_duration_days?: number | null
          rental_price?: number | null
          reserved_order_id?: string | null
          reserved_until?: string | null
          reviews_count?: number | null
          sale_price?: number | null
          seller_notes?: string | null
          sizes?: Json | null
          sold?: boolean
          stock?: number
          verified_clean?: boolean
          views_day?: string
          views_today?: number
          views_total?: number
          worn_times?: string | null
        }
        Update: {
          active?: boolean | null
          badge?: string | null
          brand?: string | null
          category_id?: string | null
          colors?: Json | null
          condition?: string | null
          created_at?: string | null
          description_ar?: string | null
          gender?: string | null
          id?: string
          image_url?: string
          images?: Json | null
          name_ar?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          rentable?: boolean
          rental_deposit?: number | null
          rental_duration_days?: number | null
          rental_price?: number | null
          reserved_order_id?: string | null
          reserved_until?: string | null
          reviews_count?: number | null
          sale_price?: number | null
          seller_notes?: string | null
          sizes?: Json | null
          sold?: boolean
          stock?: number
          verified_clean?: boolean
          views_day?: string
          views_today?: number
          views_total?: number
          worn_times?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      rental_requests: {
        Row: {
          created_at: string
          event_date: string | null
          full_name: string
          id: string
          message: string | null
          phone: string
          product_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          full_name: string
          id?: string
          message?: string | null
          phone: string
          product_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_date?: string | null
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          product_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_items_availability: {
        Args: { _product_ids: string[] }
        Returns: {
          available: boolean
          product_id: string
          reason: string
        }[]
      }
      create_order_atomic: {
        Args: { _customer: Json; _items: Json; _shipping?: number }
        Returns: {
          order_id: string
          order_number: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_product_view: {
        Args: { _product_id: string }
        Returns: undefined
      }
      track_order: {
        Args: { _order_number: string; _phone: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "rejected"
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
      app_role: ["admin", "user"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "rejected",
      ],
    },
  },
} as const
