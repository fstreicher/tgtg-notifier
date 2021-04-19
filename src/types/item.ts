export interface Item {
  item: NestedItem;
  store: Store;
  display_name: string;
  pickup_interval: {
    start: string;
    end: string
  };
  pickup_location: Location;
  purchase_end: string;
  items_available: number;
  distance: number;
  favorite: boolean;
  in_sales_window: boolean;
  new_item: boolean;
}

interface NestedItem {
  item_id: string;
  price: Money;
  sales_taxes: Array<unknown>;
  tax_amount: Money;
  price_excluding_taxes: Money;
  price_including_taxes: Money;
  value_excluding_taxes: Money;
  value_including_taxes: Money;
  taxation_policy: 'PRICE_INCLUDES_TAXES';
  show_sales_taxes: boolean;
  cover_picture: Image;
  logo_picture: Image;
  name: string;
  description: string;
  can_user_supply_packaging: boolean;
  packaging_option: PackagingOption;
  diet_categories: Array<DietCategories>;
  item_category: ItemCategories;
  badges: Array<Badge>;
  positive_rating_reasons: Array<RatingReason>;
  favorite_count: number;
  buffet: boolean;
}

interface Money {
  code: 'EUR';
  minor_units: number;
  decimals: number;
}

interface Image {
  picture_id: number;
  current_url: string;
}

enum PackagingOption {
  'BAG_ALLOWED',
  'MUST_BRING_BAG'
}

enum DietCategories {
  'VEGETARIAN'
}

enum ItemCategories {
  'BAKED_GOODS',
  'GROCERIES'
}

interface Badge {
  badge_type: BadgeType;
  rating_group: RatingGroup;
  percentage: number;
  user_count: number;
  month_count: number
}

enum BadgeType {
  'SERVICE_RATING_SCORE',
  'OVERALL_RATING_TRUST_SCORE'
}

enum RatingGroup {
  'LOVED'
}

enum RatingReason {
  'POSITIVE_FEEDBACK_DELICIOUS_FOOD',
  'POSITIVE_FEEDBACK_FRIENDLY_STAFF',
  'POSITIVE_FEEDBACK_GREAT_QUANTITY',
  'POSITIVE_FEEDBACK_GREAT_VALUE',
  'POSITIVE_FEEDBACK_GREAT_VARIETY',
  'POSITIVE_FEEDBACK_QUICK_COLLECTION'
}

interface Location {
  address: {
    country: {
      iso_code: string;
      name: string
    };
    address_line: string;
    city: string;
    postal_code: string
  };
  location: {
    longitude: number;
    latitude: number;
  }
}

interface Store {
  store_id: string;
  store_name: string;
  branch: string;
  description: string;
  tax_identifier: string;
  website: string;
  store_location: Location;
  logo_picture: Image;
  store_time_zone: string;
  hidden: boolean;
  favorite_count: number;
  we_care: boolean;
  distance: number;
  cover_picture: Image;
}
