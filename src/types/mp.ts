export interface MP {
  id: number;
  name: string;
  party: string;
  constituency: string;
  email: string;
  phone: string;
  website: string;
  office_address: string;
  postcode: string;
  image_url: string;
  parliament_id: number;
  created_at: string;
  constituencyPostcodes?: string[];
}

export interface PostcodeMapping {
  [postcode: string]: {
    name: string;
    constituency: string;
    party: string;
    email: string;
    phone: string;
    website: string;
    mp_id: number;
    image_url: string;
  };
}

export interface Constituency {
  name: string;
  mp: MP;
  postcodes: string[];
  region?: string;
  country?: string;
}

export interface DatabaseStatistics {
  totalMPs: number;
  totalPostcodes: number;
  totalConstituencies: number;
  partiesCount: { [party: string]: number };
  photosAvailable: number;
  photosPlaceholder: number;
  lastUpdated: string;
}

export interface DatabaseStructure {
  mps: MP[];
  postcodeMapping: PostcodeMapping;
  constituencies: { [constituency: string]: Constituency };
  statistics: DatabaseStatistics;
}

export default MP;