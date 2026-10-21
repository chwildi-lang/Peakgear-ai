/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mountain, 
  Backpack, 
  Shirt, 
  Zap, 
  Camera, 
  Users, 
  Compass, 
  ShieldAlert, 
  FileText,
  SlidersHorizontal,
  ChevronDown,
  LayoutDashboard,
  Star
} from 'lucide-react';
import { 
  GearItem, 
  GpxTour, 
  WeatherCondition, 
  UserProfile, 
  TourFeedback 
} from './types/app';
import { 
  INITIAL_GEAR, 
  INITIAL_TOURS, 
  INITIAL_USER_PROFILES 
} from './data/outdoorData';
import { generatePackingRecommendation } from './utils/recommendationEngine';
import { fetchLiveWeatherForTour } from './utils/weatherService';
import { DashboardView } from './components/DashboardView';
import { TourSelectorView } from './components/TourSelectorView';
import { PackAdvisorView } from './components/PackAdvisorView';
import { GearClosetView } from './components/GearClosetView';
import { FeedbackLearningView } from './components/FeedbackLearningView';
import { AiCameraScannerModal } from './components/AiCameraScannerModal';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tours' | 'advisor' | 'closet' | 'feedback'>('dashboard');

  // Modals
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Core Data Stores (with LocalStorage)
  const [gear, setGear] = useState<GearItem[]>(() => {
    const saved = localStorage.getItem('peakgear_closet_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_GEAR;
  });

  const [tours, setTours] = useState<GpxTour[]>(() => {
    const saved = localStorage.getItem('peakgear_tours_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TOURS;
  });

  const [selectedTour, setSelectedTour] = useState<GpxTour>(() => tours[0] || INITIAL_TOURS[0]);

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('peakgear_profiles_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USER_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => profiles[0]?.id || 'user-1');

  // Weather condition state (initialized with regional data, enriched via Google Search)
  const [weather, setWeather] = useState<WeatherCondition>({
    valleyTempC: 14,
    mountainTempC: 2,
    windKmh: 30,
    precipitation: 'sun',
    avalancheLevel: 2, // Mäßig
    avalancheWarning: 'Mäßige Lawinengefahr (Stufe 2): Triebschneefelder an Nordost-Hängen oberhalb 2.200m.',
    freezingAltitudeM: 2500,
    regionName: selectedTour?.region || 'Wettersteingebirge',
    fetchedViaGoogleSearch: false
  });

  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const weatherCacheRef = useRef<Record<string, { weather: WeatherCondition; time: number }>>({});

  // Google Search Live Weather Fetcher with client-side 15-minute caching
  const handleFetchGoogleSearchWeather = async (targetTour: GpxTour = selectedTour, forceRefresh = false) => {
    const cachedEntry = weatherCacheRef.current[targetTour.id];
    const isFresh = cachedEntry && (Date.now() - cachedEntry.time < 15 * 60 * 1000);

    if (!forceRefresh && isFresh) {
      setWeather(cachedEntry.weather);
      return;
    }

    setIsLoadingWeather(true);
    setWeather(prev => ({ ...prev, isLiveLoading: true }));
    try {
      const updated = await fetchLiveWeatherForTour(targetTour, weather);
      weatherCacheRef.current[targetTour.id] = { weather: updated, time: Date.now() };
      setWeather(updated);
    } catch {
      setWeather(prev => ({ ...prev, isLiveLoading: false }));
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Automatically fetch live Google Search weather on tour change (cached)
  useEffect(() => {
    handleFetchGoogleSearchWeather(selectedTour, false);
  }, [selectedTour.id]);

  // Local storage effects
  useEffect(() => {
    localStorage.setItem('peakgear_closet_data', JSON.stringify(gear));
  }, [gear]);

  useEffect(() => {
    localStorage.setItem('peakgear_tours_data', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('peakgear_profiles_data', JSON.stringify(profiles));
  }, [profiles]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Dynamic recommendation calculated on the fly
  const recommendation = generatePackingRecommendation(
    selectedTour,
    weather,
    activeProfile,
    gear
  );

  const handleAddCustomTour = (newTour: GpxTour) => {
    setTours(prev => [newTour, ...prev]);
  };

  const handleToggleFavoriteTour = (tourId: string) => {
    setTours(prev => prev.map(t => {
      if (t.id === tourId) {
        const nextFav = !t.isFavorite;
        if (selectedTour.id === tourId) {
          setSelectedTour(curr => ({ ...curr, isFavorite: nextFav }));
        }
        return { ...t, isFavorite: nextFav };
      }
      return t;
    }));
  };

  const handleToggleFavoriteGear = (gearId: string) => {
    setGear(prev => prev.map(g => {
      if (g.id === gearId) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    }));
  };

  const handleAddGearItem = (newItem: GearItem) => {
    setGear(prev => [newItem, ...prev]);
  };

  const handleAddFeedback = (newFeedback: TourFeedback) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          feedbackHistory: [newFeedback, ...p.feedbackHistory]
        };
      }
      return p;
    }));
  };

  const handleAddProfile = (newProfile: UserProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Alpine Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Mountain className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">PeakGear</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                  Alpine GPX
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                Tour: <strong className="text-white font-medium">{selectedTour.name}</strong>
              </p>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dashboard & Favoriten</span>
              <span className="md:hidden">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'tours'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Touren & GPX</span>
              <span className="md:hidden">Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'advisor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Backpack className="w-3.5 h-3.5" />
              <span>Pack-Berater</span>
            </button>

            <button
              onClick={() => setActiveTab('closet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'closet'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ausrüstungsschrank</span>
              <span className="md:hidden">Schrank</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'feedback'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lernschleife</span>
              <span className="md:hidden">Lernen</span>
            </button>
          </nav>

          {/* Right Header Controls (AI Camera Scan + Multi-User Profile Switcher) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiScannerOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/20"
              title="Ausrüstung oder Etikett mit KI fotografieren"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">KI-Scan</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Benutzerkonto wechseln"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-semibold">{activeProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={activeProfile}
            tours={tours}
            gear={gear}
            selectedTour={selectedTour}
            weather={weather}
            onSelectTourAndGoToAdvisor={tour => {
              setSelectedTour(tour);
              setActiveTab('advisor');
            }}
            onGoToTab={tab => setActiveTab(tab)}
            onToggleFavoriteTour={handleToggleFavoriteTour}
            onToggleFavoriteGear={handleToggleFavoriteGear}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}
        {activeTab === 'tours' && (
          <TourSelectorView
            tours={tours}
            selectedTour={selectedTour}
            onSelectTour={tour => {
              setSelectedTour(tour);
              setActiveTab('advisor');
            }}
            onAddCustomTour={handleAddCustomTour}
            onProceedToAdvisor={() => setActiveTab('advisor')}
            onToggleFavoriteTour={handleToggleFavoriteTour}
          />
        )}

        {activeTab === 'advisor' && (
          <PackAdvisorView
            recommendation={recommendation}
            weather={weather}
            setWeather={setWeather}
            onGoToFeedback={() => setActiveTab('feedback')}
            onGoToCloset={() => setActiveTab('closet')}
            onFetchGoogleSearchWeather={() => handleFetchGoogleSearchWeather(selectedTour, true)}
            isLoadingWeather={isLoadingWeather}
          />
        )}

        {activeTab === 'closet' && (
          <GearClosetView
            gear={gear}
            setGear={setGear}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onToggleFavoriteGear={handleToggleFavoriteGear}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackLearningView
            userProfile={activeProfile}
            tours={tours}
            onAddFeedback={handleAddFeedback}
            onGoToAdvisor={() => setActiveTab('advisor')}
          />
        )}
      </main>

      {/* Modals */}
      <AiCameraScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onAddGearItem={handleAddGearItem}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={setActiveProfileId}
        onAddProfile={handleAddProfile}
      />
    </div>
  );
}
