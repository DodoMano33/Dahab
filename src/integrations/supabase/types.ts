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
      backtest_results: {
        Row: {
          analysis_type: string
          created_at: string
          direction: string
          entry_price: number
          exit_price: number
          id: string
          is_success: boolean
          original_analysis: Json
          profit_loss: number | null
          result_timestamp: string
          stop_loss: number | null
          symbol: string
          target_price: number | null
          timeframe: string
          user_id: string
        }
        Insert: {
          analysis_type: string
          created_at?: string
          direction: string
          entry_price: number
          exit_price: number
          id?: string
          is_success: boolean
          original_analysis: Json
          profit_loss?: number | null
          result_timestamp: string
          stop_loss?: number | null
          symbol: string
          target_price?: number | null
          timeframe: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          created_at?: string
          direction?: string
          entry_price?: number
          exit_price?: number
          id?: string
          is_success?: boolean
          original_analysis?: Json
          profit_loss?: number | null
          result_timestamp?: string
          stop_loss?: number | null
          symbol?: string
          target_price?: number | null
          timeframe?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          analysis: Json
          analysis_expiry_date: string | null
          analysis_type: string
          created_at: string
          current_price: number
          entry_point_analysis_completed: boolean | null
          id: string
          is_success: boolean | null
          last_checked_price: number | null
          original_analysis_completed: boolean | null
          result_timestamp: string | null
          stop_loss_hit: boolean
          symbol: string
          target_hit: boolean
          timeframe: string
          user_id: string
        }
        Insert: {
          analysis: Json
          analysis_expiry_date?: string | null
          analysis_type: string
          created_at?: string
          current_price: number
          entry_point_analysis_completed?: boolean | null
          id?: string
          is_success?: boolean | null
          last_checked_price?: number | null
          original_analysis_completed?: boolean | null
          result_timestamp?: string | null
          stop_loss_hit?: boolean
          symbol: string
          target_hit?: boolean
          timeframe?: string
          user_id: string
        }
        Update: {
          analysis?: Json
          analysis_expiry_date?: string | null
          analysis_type?: string
          created_at?: string
          current_price?: number
          entry_point_analysis_completed?: boolean | null
          id?: string
          is_success?: boolean | null
          last_checked_price?: number | null
          original_analysis_completed?: boolean | null
          result_timestamp?: string | null
          stop_loss_hit?: boolean
          symbol?: string
          target_hit?: boolean
          timeframe?: string
          user_id?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_analysis_type:
        | {
            Args: {
              p_user_id: string
              p_symbol: string
              p_current_price: number
              p_analysis: Json
              p_analysis_type: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_user_id: string
              p_symbol: string
              p_current_price: number
              p_analysis: Json
              p_analysis_type: string
              p_timeframe?: string
            }
            Returns: undefined
          }
      calculate_analysis_expiry: {
        Args: {
          start_timestamp: string
        }
        Returns: string
      }
      delete_expired_analyses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      move_to_backtest_results:
        | {
            Args: {
              p_search_history_id: string
              p_exit_price: number
              p_is_success: boolean
            }
            Returns: undefined
          }
        | {
            Args: {
              p_search_history_id: string
              p_exit_price: number
              p_is_success: boolean
              p_is_entry_point_analysis?: boolean
            }
            Returns: undefined
          }
      update_analysis_status: {
        Args: {
          p_id: string
          p_current_price: number
        }
        Returns: undefined
      }
      update_analysis_status_with_entry_point: {
        Args: {
          p_id: string
          p_current_price: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
