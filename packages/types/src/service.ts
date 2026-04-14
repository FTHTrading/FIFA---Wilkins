// ─── City Services & Restaurants ─────────────────────────────────────────────

export type ServiceCategory =
  | 'RESTAURANT'
  | 'HOTEL'
  | 'HOSPITAL'
  | 'URGENT_CARE'
  | 'PHARMACY'
  | 'ATM'
  | 'TRANSIT_STATION'
  | 'GROCERY'
  | 'RIDESHARE_ZONE'
  | 'EMBASSY'
  | 'CONSULATE'
  | 'PRAYER_SPACE'
  | 'CONVENIENCE'
  | 'OTHER';

export type DietaryOption =
  | 'HALAL'
  | 'KOSHER'
  | 'VEGETARIAN'
  | 'VEGAN'
  | 'GLUTEN_FREE'
  | 'DAIRY_FREE'
  | 'NUT_FREE';

export type CuisineRegion =
  | 'LATIN_AMERICAN'
  | 'WEST_AFRICAN'
  | 'MIDDLE_EASTERN'
  | 'EAST_ASIAN'
  | 'SOUTH_ASIAN'
  | 'SOUTHEAST_ASIAN'
  | 'EUROPEAN'
  | 'CARIBBEAN'
  | 'NORTH_AMERICAN'
  | 'MEDITERRANEAN'
  | 'OTHER';

export interface CityService {
  id: string;
  organizationId: string;
  eventId?: string;
  category: ServiceCategory;
  name: string;
  nameTranslations: Record<string, string>; // key: language code
  description?: string;
  descriptionTranslations: Record<string, string>;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  cuisine?: CuisineRegion;
  dietaryOptions: DietaryOption[];
  languages?: string[]; // languages spoken at location
  priceRange?: 1 | 2 | 3 | 4;
  rating?: number;
  openingHours?: OpeningHours;
  isVerified: boolean;
  isActive: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;  // "09:00"
  close: string; // "22:00"
  closed?: boolean;
}
