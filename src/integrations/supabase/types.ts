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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_reference: string
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          currency: string
          deposit_amount: number | null
          deposit_paid: boolean | null
          end_date: string | null
          guest_country: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          pricing_id: string | null
          special_requests: string | null
          status: string
          total_price: number
          tour_id: string
          travel_date: string
          travelers: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_reference: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          end_date?: string | null
          guest_country?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pricing_id?: string | null
          special_requests?: string | null
          status?: string
          total_price: number
          tour_id: string
          travel_date: string
          travelers?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_reference?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          deposit_amount?: number | null
          deposit_paid?: boolean | null
          end_date?: string | null
          guest_country?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pricing_id?: string | null
          special_requests?: string | null
          status?: string
          total_price?: number
          tour_id?: string
          travel_date?: string
          travelers?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pricing_id_fkey"
            columns: ["pricing_id"]
            isOneToOne: false
            referencedRelation: "tour_pricing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_admin_reply: boolean | null
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin_reply?: boolean | null
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin_reply?: boolean | null
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          best_time_to_visit: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          highlights: string[] | null
          id: string
          image_url: string | null
          name: string
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          best_time_to_visit?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          best_time_to_visit?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_entries: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      instagram_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          dark_mode: boolean | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          dark_mode?: boolean | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          dark_mode?: boolean | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          admin_reply: string | null
          budget_range: string | null
          country: string | null
          created_at: string
          destinations: string[] | null
          email: string
          full_name: string
          id: string
          phone: string | null
          replied_at: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          tour_type: string | null
          travel_end_date: string | null
          travel_start_date: string | null
          travelers: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          budget_range?: string | null
          country?: string | null
          created_at?: string
          destinations?: string[] | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          replied_at?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tour_type?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          travelers?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          budget_range?: string | null
          country?: string | null
          created_at?: string
          destinations?: string[] | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          replied_at?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tour_type?: string | null
          travel_end_date?: string | null
          travel_start_date?: string | null
          travelers?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_response: string | null
          content: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          platform: string | null
          rating: number
          reviewer_country: string | null
          reviewer_email: string | null
          reviewer_name: string
          title: string | null
          tour_id: string | null
          travel_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          platform?: string | null
          rating: number
          reviewer_country?: string | null
          reviewer_email?: string | null
          reviewer_name: string
          title?: string | null
          tour_id?: string | null
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          platform?: string | null
          rating?: number
          reviewer_country?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
          title?: string | null
          tour_id?: string | null
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      tour_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          tour_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          tour_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_images_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itineraries: {
        Row: {
          accommodation: string | null
          created_at: string
          day_number: number
          description: string | null
          highlights: string[] | null
          id: string
          location: string | null
          meals_included: string[] | null
          title: string
          tour_id: string
        }
        Insert: {
          accommodation?: string | null
          created_at?: string
          day_number: number
          description?: string | null
          highlights?: string[] | null
          id?: string
          location?: string | null
          meals_included?: string[] | null
          title: string
          tour_id: string
        }
        Update: {
          accommodation?: string | null
          created_at?: string
          day_number?: number
          description?: string | null
          highlights?: string[] | null
          id?: string
          location?: string | null
          meals_included?: string[] | null
          title?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_itineraries_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_pricing: {
        Row: {
          created_at: string
          currency: string
          exclusions: string[] | null
          id: string
          inclusions: string[] | null
          max_travelers: number | null
          min_travelers: number | null
          price_per_person: number
          tier_name: string
          tour_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          exclusions?: string[] | null
          id?: string
          inclusions?: string[] | null
          max_travelers?: number | null
          min_travelers?: number | null
          price_per_person: number
          tier_name?: string
          tour_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          exclusions?: string[] | null
          id?: string
          inclusions?: string[] | null
          max_travelers?: number | null
          min_travelers?: number | null
          price_per_person?: number
          tier_name?: string
          tour_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_pricing_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string
          description: string | null
          destinations: string[] | null
          difficulty_level: string | null
          duration: string | null
          featured: boolean | null
          group_size_max: number | null
          group_size_min: number | null
          highlights: string[] | null
          id: string
          image_url: string | null
          languages: string[] | null
          map_coordinates: Json | null
          max_travelers: number | null
          min_age: number | null
          name: string
          price: number | null
          rating: number | null
          review_count: number | null
          short_description: string | null
          slug: string
          tour_type: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          destinations?: string[] | null
          difficulty_level?: string | null
          duration?: string | null
          featured?: boolean | null
          group_size_max?: number | null
          group_size_min?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          map_coordinates?: Json | null
          max_travelers?: number | null
          min_age?: number | null
          name: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug: string
          tour_type?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          destinations?: string[] | null
          difficulty_level?: string | null
          duration?: string | null
          featured?: boolean | null
          group_size_max?: number | null
          group_size_min?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          map_coordinates?: Json | null
          max_travelers?: number | null
          min_age?: number | null
          name?: string
          price?: number | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          slug?: string
          tour_type?: string | null
          updated_at?: string
          video_url?: string | null
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
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_reviews: {
        Row: {
          admin_response: string | null
          content: string | null
          created_at: string | null
          id: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          platform: string | null
          rating: number | null
          reviewer_country: string | null
          reviewer_name: string | null
          title: string | null
          tour_id: string | null
          travel_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          platform?: string | null
          rating?: number | null
          reviewer_country?: string | null
          reviewer_name?: string | null
          title?: string | null
          tour_id?: string | null
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          platform?: string | null
          rating?: number | null
          reviewer_country?: string | null
          reviewer_name?: string | null
          title?: string | null
          tour_id?: string | null
          travel_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      quote_status: "pending" | "replied" | "closed"
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
      quote_status: ["pending", "replied", "closed"],
    },
  },
} as const
