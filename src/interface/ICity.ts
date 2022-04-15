export interface CityCreate {
  state: string;
  county: string;
  city: string;
}

export interface CityUpdate {
  state?: string;
  county?: string;
  city?: string;
}