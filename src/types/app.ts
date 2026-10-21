export type SportType = 
  | 'hiking'
  | 'trailrunning'
  | 'mountaineering'
  | 'skitour'
  | 'snowshoe'
  | 'via_ferrata'
  | 'gravel_bike';

export type GearCategory = 
  | 'baselayer'
  | 'midlayer'
  | 'hardshell'
  | 'pants'
  | 'footwear'
  | 'hardware'
  | 'safety'
  | 'accessories'
  | 'food_hydration';

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: GearCategory;
  weightGrams: number;
  tempMin: number; // in °C
  tempMax: number; // in °C
  isWaterproof: boolean;
  isWindproof: boolean;
  sports: SportType[];
  notes?: string;
  condition: 'Neuwertig' | 'Sehr gut' | 'Gebraucht' | 'Erneuerungsbedürftig';
  imageSrc?: string;
  isMandatorySafety?: boolean;
  isFavorite?: boolean;
}

export interface ProfilePoint {
  distKm: number;
  altitudeM: number;
}

export interface GpxTour {
  id: string;
  name: string;
  sport: SportType;
  region: string;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  maxAltitudeM: number;
  minAltitudeM: number;
  estimatedHours: number;
  technicalDifficulty: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  terrain: string[];
  description: string;
  profilePoints: ProfilePoint[];
  gpxRaw?: string;
  isFavorite?: boolean;
}

export interface WeatherCondition {
  valleyTempC: number;
  mountainTempC: number;
  windKmh: number;
  precipitation: 'sun' | 'cloudy' | 'rain' | 'snow' | 'storm';
  avalancheLevel: 1 | 2 | 3 | 4 | 5; // Europäische Lawinengefahrenstufe 1-5
  avalancheWarning: string;
  freezingAltitudeM: number; // Nullgradgrenze
  regionName?: string;
  fetchedViaGoogleSearch?: boolean;
  lastUpdated?: string;
  searchSummary?: string;
  searchSources?: string[];
  isLiveLoading?: boolean;
}

export interface TourFeedback {
  id: string;
  tourId: string;
  tourName: string;
  date: string;
  tempFeeling: 'zu_kalt' | 'genau_richtig' | 'zu_warm';
  weightRating: 'zu_schwer' | 'optimal' | 'leicht';
  gearMissed: string[];
  gearUnused: string[];
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  coldSensitivity: 'frierend' | 'normal' | 'schwitzend'; // Kälteempfindlich vs. schwitzt schnell
  safetyPriority: 'ultralight' | 'ausgewogen' | 'sicherheit_zuerst';
  experienceLevel: 'Einsteiger' | 'Fortgeschritten' | 'Alpinist';
  feedbackHistory: TourFeedback[];
}

export interface BreakRecommendation {
  km: number;
  altitudeM: number;
  title: string;
  timeEstimate: string;
  tip: string;
  clothingTip: string;
  hydrationKcal: string;
}

export interface PackingRecommendation {
  tour: GpxTour;
  weather: WeatherCondition;
  wearOnBody: GearItem[];
  packInBackpack: GearItem[];
  mandatorySafety: Array<{ item: GearItem; reason: string; isHighAlert: boolean }>;
  missingEssentialGear: string[];
  breaks: BreakRecommendation[];
  totalWeightKg: number;
  avalancheRiskAlert?: {
    level: number;
    title: string;
    mandatoryChecklist: string[];
  };
  adaptiveLearningNote?: string;
}
