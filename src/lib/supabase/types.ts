export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'customer' | 'operator' | 'admin';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type ReservationStatus = 'active' | 'consumed' | 'released';
export type FulfillmentType = 'delivery' | 'pickup';
export type CouponType = 'percentage' | 'fixed';
export type OrderStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'expired' | 'exception';
export type FulfillmentStatus = 'unstarted' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'partially_refunded' | 'refunded' | 'chargeback';
export type RefundStatus = 'pending' | 'approved' | 'failed';
export type WebhookStatus = 'received' | 'processing' | 'processed' | 'ignored' | 'failed';
export type OutboxStatus = 'pending' | 'processing' | 'sent' | 'failed';
export type InquiryStatus = 'received' | 'in_review' | 'responded' | 'approved' | 'closed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: AppRole;
          created_at?: string;
        };
        Update: {
          role?: AppRole;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          active?: boolean;
          sort_order?: number;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          ingredients: string | null;
          allergens: string | null;
          storage_instructions: string | null;
          status: ProductStatus;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          ingredients?: string | null;
          allergens?: string | null;
          storage_instructions?: string | null;
          status?: ProductStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          ingredients?: string | null;
          allergens?: string | null;
          storage_instructions?: string | null;
          status?: ProductStatus;
          featured?: boolean;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          label: string;
          unit_label: string;
          weight_grams: number | null;
          price_cents: number;
          active: boolean;
          min_qty: number;
          max_qty: number;
          lead_time_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          label: string;
          unit_label?: string;
          weight_grams?: number | null;
          price_cents: number;
          active?: boolean;
          min_qty?: number;
          max_qty?: number;
          lead_time_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sku?: string;
          label?: string;
          unit_label?: string;
          weight_grams?: number | null;
          price_cents?: number;
          active?: boolean;
          min_qty?: number;
          max_qty?: number;
          lead_time_minutes?: number;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          storage_path?: string;
          alt_text?: string;
          sort_order?: number;
        };
      };
      inventory: {
        Row: {
          variant_id: string;
          on_hand: number;
          reserved: number;
          updated_at: string;
        };
        Insert: {
          variant_id: string;
          on_hand?: number;
          reserved?: number;
          updated_at?: string;
        };
        Update: {
          on_hand?: number;
          reserved?: number;
          updated_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          postal_code_from: string;
          postal_code_to: string;
          fee_cents: number;
          minimum_cents: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          postal_code_from: string;
          postal_code_to: string;
          fee_cents?: number;
          minimum_cents?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          postal_code_from?: string;
          postal_code_to?: string;
          fee_cents?: number;
          minimum_cents?: number;
          active?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          public_number: string;
          user_id: string | null;
          contact_snapshot: Json;
          address_snapshot: Json | null;
          fulfillment_type: FulfillmentType;
          slot_id: string | null;
          subtotal_cents: number;
          discount_cents: number;
          delivery_fee_cents: number;
          total_cents: number;
          currency: string;
          order_status: OrderStatus;
          fulfillment_status: FulfillmentStatus;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          public_number: string;
          user_id?: string | null;
          contact_snapshot: Json;
          address_snapshot?: Json | null;
          fulfillment_type: FulfillmentType;
          slot_id?: string | null;
          subtotal_cents: number;
          discount_cents?: number;
          delivery_fee_cents?: number;
          total_cents: number;
          currency?: string;
          order_status?: OrderStatus;
          fulfillment_status?: FulfillmentStatus;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_status?: OrderStatus;
          fulfillment_status?: FulfillmentStatus;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          name_snapshot: string;
          sku_snapshot: string;
          variant_snapshot: string;
          unit_price_cents: number;
          quantity: number;
          line_total_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id: string;
          name_snapshot: string;
          sku_snapshot: string;
          variant_snapshot: string;
          unit_price_cents: number;
          quantity: number;
          line_total_cents: number;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: number;
          store_name: string;
          tagline: string;
          phone: string | null;
          email: string | null;
          address_display: string | null;
          pickup_details: Json;
          ordering_enabled: boolean;
          policies_version: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          store_name?: string;
          tagline?: string;
          phone?: string | null;
          email?: string | null;
          address_display?: string | null;
          pickup_details?: Json;
          ordering_enabled?: boolean;
          policies_version?: string;
          updated_at?: string;
        };
        Update: {
          store_name?: string;
          tagline?: string;
          phone?: string | null;
          email?: string | null;
          address_display?: string | null;
          pickup_details?: Json;
          ordering_enabled?: boolean;
          policies_version?: string;
          updated_at?: string;
        };
      };
    };
  };
}
