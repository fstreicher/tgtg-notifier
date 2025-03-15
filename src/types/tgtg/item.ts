export interface DiscoverResponse {
  mobile_bucket: {
    filler_type: string;
    title: string;
    description: string;
    items: Array<Item>;
    bucket_type: string;
    display_type: string;
  };
}

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
  item_type: string;
  matches_filters: boolean;
  item_tags: Array<ItemTag>;
}

interface NestedItem {
  item_id: string;
  sales_taxes: Array<Tax>;
  tax_amount: Money;
  price_excluding_taxes: Money;
  price_including_taxes: Money;
  value_excluding_taxes: Money;
  value_including_taxes: Money;
  taxation_policy: string;
  show_sales_taxes: boolean;
  item_price: Money;
  item_value: Money;
  sold_out_at_dynamic_item_price: Money;
  cover_picture: Image;
  logo_picture: Image;
  name: string;
  description: string;
  subtitle: string;
  food_handling_instructions: string;
  can_user_supply_packaging: boolean;
  packaging_option: PackagingOption;
  collection_info: string;
  diet_categories: Array<DietCategory>;
  item_category: ItemCategory;
  buffet: boolean;
  positive_rating_reasons: Array<RatingReason>;
  average_overall_rating: AverageRating;
  price_info: PriceInfo;
  favorite_count: number;
}

interface Tax {
  tax_description: string;
  tax_percentage: number;
}

interface Money {
  /** eg. `EUR` */
  code: string;
  minor_units: number;
  decimals: number;
}

interface Image {
  picture_id: number;
  current_url: string;
}

type PackagingOption = 'BAG_ALLOWED' | 'MUST_BRING_BAG';

type DietCategory = 'VEGETARIAN';

type ItemCategory = 'BAKED_GOODS' | 'GROCERIES';

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

type RatingGroup = 'LOVED';

type RatingReason =
  | 'POSITIVE_FEEDBACK_DELICIOUS_FOOD'
  | 'POSITIVE_FEEDBACK_FRIENDLY_STAFF'
  | 'POSITIVE_FEEDBACK_GREAT_QUANTITY'
  | 'POSITIVE_FEEDBACK_GREAT_VALUE'
  | 'POSITIVE_FEEDBACK_GREAT_VARIETY'
  | 'POSITIVE_FEEDBACK_QUICK_COLLECTION';

interface AverageRating {
  average_overall_rating: number;
  rating_count: number;
  month_count: number;
  average_collection_experience_rating: number;
  average_food_quality_rating: number;
  average_contents_variety_rating: number;
  average_food_quantity_rating: number;
}

interface PriceInfo {
  type: string;
  is_recurring: boolean;
  is_personal: boolean;
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
  distance: number;
  cover_picture: Image;
  is_manufacturer: boolean;
}

interface ItemTag {
  id: string;
  short_text: string;
  long_text: string;
}
