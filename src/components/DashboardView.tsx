import React from 'react';
import { 
  Star, 
  Mountain, 
  Backpack, 
  Shirt, 
  Camera, 
  ArrowRight, 
  Weight, 
  Thermometer, 
  Compass, 
  Sparkles,
  Footprints,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { GearItem, GpxTour, UserProfile, WeatherCondition } from '../types/app';
import { GpxElevationChart } from './GpxElevationChart';

interface DashboardViewProps {
  userProfile: UserProfile;
  tours: GpxTour[];
  gear: GearItem[];
  selectedTour: GpxTour;
  weather: WeatherCondition;
  onSelectTourAndGoToAdvisor: (tour: GpxTour) => void;
  onGoToTab: (tab: 'dashboard' | 'tours' | 'advisor' | 'closet' | 'feedback') => void;
  onToggleFavoriteTour: (tourId: string) => void;
  onToggleFavoriteGear: (gearId: string) => void;
  onOpenAiScanner: () => void;
  onOpenProfileModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  tours,
  gear,
  selectedTour,
  weather,
  onSelectTourAndGoToAdvisor,
  onGoToTab,
  onToggleFavoriteTour,
  onToggleFavoriteGear,
  onOpenAiScanner,
  onOpenProfileModal
}) => {
  const favoriteTours = tours.filter(t => !!t.isFavorite);
  const favoriteGear = gear.filter(g => !!g.isFavorite);

  const sportsMap: Record<string, { label: string; icon: string }> = {
    hiking: { label: 'Bergwandern', icon: '🥾' },
    trailrunning: { label: 'Trailrunning', icon: '🏃' },
    mountaineering: { label: 'Bergsteigen', icon: '⛰️' },
    skitour: { label: 'Skitour', icon: '⛷️' },
    snowshoe: { label: 'Schneeschuhe', icon: '❄️' },
    via_ferrata: { label: 'Klettersteig', icon: '🧗' },
    gravel_bike: { label: 'Gravel / Bike', icon: '🚴' }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Welcome & Fast Stats Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400" />
                Persönliche Favoriten-Zentrale
              </span>
              <span className="text-xs text-slate-500">·</span>
              <button
                onClick={onOpenProfileModal}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Konto: {userProfile.name}
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Hallo {userProfile.name.split(' ')[0]}, hier sind deine Favoriten
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Direkter Schnellzugriff auf deine bevorzugten Touren und deine Go-To Ausrüstung. 
              Wähle eine Tour mit einem Klick, um sofort die personalisierte Packliste und Wetterlage zu laden.
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
            <button
              onClick={() => onGoToTab('advisor')}
              className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Backpack className="w-4 h-4" />
              <span>Pack-Berater öffnen</span>
            </button>

            <button
              onClick={onOpenAiScanner}
              className="px-3.5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>KI-Scan</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              Favoriten-Touren
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {favoriteTours.length} Routen
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Ausrüstungs-Favoriten
            </div>
            <div className="text-xl font-bold text-amber-300 mt-1">
              {favoriteGear.length} Teile
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Aktive Tour
            </div>
            <div className="text-sm font-bold text-white mt-1 truncate" title={selectedTour.name}>
              {selectedTour.name}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              Tal / Berg Temp
            </div>
            <div className="text-sm font-bold text-white mt-1 font-mono">
              {weather.valleyTempC}°C / {weather.mountainTempC}°C
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Favoriten-Touren */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Deine Favoriten-Touren ({favoriteTours.length})
            </h3>
          </div>
          <button
            onClick={() => onGoToTab('tours')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>Alle {tours.length} Touren ansehen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {favoriteTours.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 space-y-2">
            <Star className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">Noch keine Touren als Favorit markiert</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Gehe in die Tourenübersicht und klicke auf das Stern-Symbol (⭐), um Touren für den schnellen Direktzugriff hier abzulegen.
            </p>
            <button
              onClick={() => onGoToTab('tours')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Touren durchstöbern
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTours.map(tour => {
              const isSelected = selectedTour.id === tour.id;

              return (
                <div
                  key={tour.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sportsMap[tour.sport]?.icon || '⛰️'}</span>
                        <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                          SAC {tour.technicalDifficulty}
                        </span>
                      </div>

                      {/* Favorite Toggle Button */}
                      <button
                        onClick={() => onToggleFavoriteTour(tour.id)}
                        title="Aus Favoriten entfernen"
                        className="p-1 rounded text-amber-400 hover:text-slate-400 transition-colors cursor-pointer"
                      >
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {tour.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {tour.region}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {tour.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Distanz</span>
                      <strong className="text-white">{tour.distanceKm} km</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Aufstieg</span>
                      <strong className="text-emerald-400">+{tour.elevationGainM}m</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Gipfel</span>
                      <strong className="text-indigo-300">{tour.maxAltitudeM}m</strong>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectTourAndGoToAdvisor(tour)}
                    className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Tour auswählen & Packliste berechnen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Favoriten-Ausrüstung (Go-To Equipment) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Deine Go-To Ausrüstungs-Favoriten ({favoriteGear.length})
            </h3>
          </div>
          <button
            onClick={() => onGoToTab('closet')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>Alle {gear.length} Ausrüstungsteile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {favoriteGear.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 space-y-2">
            <Shirt className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">Noch keine Ausrüstung als Favorit markiert</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Markiere deine am häufigsten getragenen Teile (z. B. Hardshell, Schuhe, LVS) mit einem Stern im Schrank.
            </p>
            <button
              onClick={() => onGoToTab('closet')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
            >
              Zum Ausrüstungsschrank
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {favoriteGear.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">
                          {item.name}
                        </h4>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-emerald-400">{item.brand}</span>
                        <span> · </span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFavoriteGear(item.id)}
                      title="Aus Favoriten entfernen"
                      className="p-1 rounded text-amber-400 hover:text-slate-500 transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </button>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Weight className="w-3.5 h-3.5 text-slate-500" />
                    {item.weightGrams}g
                  </span>
                  <span>
                    {item.tempMin}°C bis {item.tempMax}°C
                  </span>
                  {item.isWaterproof && (
                    <span className="text-cyan-400 font-sans text-[11px]">Wasserdicht</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
