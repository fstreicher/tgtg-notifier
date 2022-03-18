export interface LoginRequestResponseData {
  polling_id: string,
  state: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  startup_data: {
    user: {
      user_id: string;
      name: string;
      country_id: string;
      email: string;
      phone_country_code: string;
      phone_number: string;
      role: 'CONSUMER';
      is_partner: boolean;
      newsletter_opt_in: boolean;
      push_notifications_opt_in: boolean;
    };
    app_settings: {
      on_app_open_message: 'BLOCKING';
      open_message_type: 'BLOCKING';
      open_message_url: string;
      countries: Array<{
        country_iso_code: string;
        terms_url: string;
        privacy_url: string;
      }>;
      purchase_rating_start: string; // 'HH:MM:SS'
      purchase_rating_end: string;
      purchase_rating_delay: number;
    };
    user_settings: {
      country_iso_code: string;
      phone_country_code_suggestion: string;
      is_user_email_verified: boolean;
      terms_url: string;
      privacy_url: string;
      contact_form_url: string;
      blog_url: string;
      careers_url: string;
      education_url: string;
      instagram_url: string;
      store_signup_url: string;
      store_contact_url: string;
      bound_sw: {
        longitude: number;
        latitude: number;
      };
      bound_ne: {
        longitude: number;
        latitude: number;
      };
      meals_saved: {
        country_iso_code: string;
        share_url: string;
        image_url: string;
        meals_saved_last_month: number;
        month: number;
        year: number;
      };
      has_any_vouchers: boolean;
      can_show_best_before_explainer: boolean
    };
    orders: {
      current_time: string; // ISO string
      has_more: boolean;
      orders: Array<unknown>
    };
    vouchers: {
      vouchers: Array<unknown>
    }
  }
}