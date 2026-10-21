import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  AlertTriangle, 
  Thermometer, 
  ShieldAlert,
  Compass,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { GpxTour, WeatherCondition } from '../types/app';
import { calculateEffectiveTemperature } from '../utils/recommendationEngine';

interface WeatherSimulationBarProps {
  weather: WeatherCondition;
  setWeather: React.Dispatch<React.SetStateAction<WeatherCondition>>;
  elevationGainM: number;
  maxAltitudeM: number;
  tour: GpxTour;
  onFetchGoogleSearchWeather?: () => Promise<void>;
  isLoadingWeather?: boolean;
}

export const WeatherSimulationBar: React.FC<WeatherSimulationBarProps> = ({
  weather,
  setWeather,
  elevationGainM,
  maxAltitudeM,
  tour,
  onFetchGoogleSearchWeather,
  isLoadingWeather = false
}) => {
  const { summitTempC, windchillC } = calculateEffectiveTemperature(
    weather.valleyTempC, 
    elevationGainM, 
    weather.windKmh
  );

  const avalancheLevelDescriptions: Record<number, { label: string; bg: string; text: string; border: string }> = {
    1: { label: 'Stufe 1 (Gering)', bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800' },
    2: { label: 'Stufe 2 (Mäßig)', bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800' },
    3: { label: 'Stufe 3 (Erheblich)', bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-800' },
    4: { label: 'Stufe 4 (Groß)', bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800' },
    5: { label: 'Stufe 5 (Sehr groß)', bg: 'bg-purple-950/50', text: 'text-purple-300', border: 'border-purple-800' }
  };

  const currentLevelInfo = avalancheLevelDescriptions[weather.avalancheLevel];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Banner: Region & Google Search Weather Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Wetter- & Lawinenlage
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-semibold text-white">
              Region: {tour.region}
            </span>
            {weather.fetchedViaGoogleSearch && (
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Google Search Live-Wetter
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Echtzeit-Berechnung von Höhenabkühlung (-0.65°C / 100m) und Windchill am Gipfel ({maxAltitudeM}m).
          </p>
        </div>

        {/* Live Weather Trigger Button & Status */}
        <div className="flex items-center gap-3 flex-wrap">
          {onFetchGoogleSearchWeather && (
            <button
              onClick={onFetchGoogleSearchWeather}
              disabled={isLoadingWeather || weather.isLiveLoading}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              title="Aktuelle Wetterdaten & Lawinenlage via Google Search für diese Region abrufen"
            >
              {isLoadingWeather || weather.isLiveLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Google Search sucht Wetterdaten...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Wetter via Google Search abrufen</span>
                </>
              )}
            </button>
          )}

          {/* Summit Temperature Pill */}
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Gipfel real / gefühlt: </span>
            <strong className="text-white">{summitTempC}°C</strong>
            <span className="text-slate-500"> / </span>
            <strong className={windchillC < 0 ? 'text-cyan-400' : 'text-emerald-400'}>
              {windchillC}°C Windchill
            </strong>
          </div>
        </div>
      </div>

      {/* Google Search Live Enrichment Info Banner */}
      {weather.fetchedViaGoogleSearch && (
        <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-300 font-medium">
              {weather.searchSummary || `Aktuelle Wetterlage für ${tour.region}`}
            </span>
            {weather.lastUpdated && (
              <span className="text-slate-500 font-mono text-[11px]">
                ({weather.lastUpdated})
              </span>
            )}
          </div>

          {weather.searchSources && weather.searchSources.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-shrink-0">
              <span className="text-slate-500">Quellen:</span>
              <span className="text-emerald-400/90 font-medium truncate max-w-xs">
                {weather.searchSources.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Valley Temp Slider */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="flex items-center gap-1 text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Temperatur Tal
            </span>
            <span className="font-mono font-bold text-white">{weather.valleyTempC}°C</span>
          </div>
          <input
            type="range"
            min="-15"
            max="35"
            step="1"
            value={weather.valleyTempC}
            onChange={e => setWeather(prev => ({ 
              ...prev, 
              valleyTempC: parseInt(e.target.value, 10),
              fetchedViaGoogleSearch: false 
            }))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
            <span>-15°C</span>
            <span>+10°C</span>
            <span>+35°C</span>
          </div>
        </div>

        {/* Wind Speed Slider */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span className="flex items-center gap-1 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Windgeschwindigkeit
            </span>
            <span className="font-mono font-bold text-white">{weather.windKmh} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={weather.windKmh}
            onChange={e => setWeather(prev => ({ 
              ...prev, 
              windKmh: parseInt(e.target.value, 10),
              fetchedViaGoogleSearch: false 
            }))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
            <span>0 (Windstill)</span>
            <span>40 (Frisch)</span>
            <span>80+ (Sturm)</span>
          </div>
        </div>

        {/* Precipitation Buttons */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
          <span className="block text-xs text-slate-400 mb-2">Wetterlage</span>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setWeather(prev => ({ ...prev, precipitation: 'sun', fetchedViaGoogleSearch: false }))}
              title="Sonnig"
              className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                weather.precipitation === 'sun' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'text-slate-500 hover:text-slate-300 bg-slate-900'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeather(prev => ({ ...prev, precipitation: 'cloudy', fetchedViaGoogleSearch: false }))}
              title="Bewölkt"
              className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                weather.precipitation === 'cloudy' ? 'bg-slate-700 text-white border border-slate-600' : 'text-slate-500 hover:text-slate-300 bg-slate-900'
              }`}
            >
              <Cloud className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeather(prev => ({ ...prev, precipitation: 'rain', fetchedViaGoogleSearch: false }))}
              title="Regen"
              className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                weather.precipitation === 'rain' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' : 'text-slate-500 hover:text-slate-300 bg-slate-900'
              }`}
            >
              <CloudRain className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeather(prev => ({ ...prev, precipitation: 'snow', fetchedViaGoogleSearch: false }))}
              title="Schneefall"
              className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                weather.precipitation === 'snow' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-slate-300 bg-slate-900'
              }`}
            >
              <CloudSnow className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avalanche Danger Level Selector (Europäische Lawinengefahrenstufe 1-5) */}
        <div className={`p-3.5 rounded-xl border transition-all ${currentLevelInfo.bg} ${currentLevelInfo.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5 text-slate-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Lawinengefahr
            </span>
            <span className={`text-xs font-bold font-mono ${currentLevelInfo.text}`}>
              Stufe {weather.avalancheLevel} / 5
            </span>
          </div>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => setWeather(prev => ({ ...prev, avalancheLevel: lvl as any, fetchedViaGoogleSearch: false }))}
                className={`flex-1 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  weather.avalancheLevel === lvl
                    ? 'bg-white text-slate-950 shadow-sm scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            {weather.avalancheWarning || (
              weather.avalancheLevel >= 2 
                ? 'LVS-Gerät, Sonde & Schaufel sind zwingende Pflicht im Gepäck!'
                : 'Geringe Gefahr. Standard-Vorsichtsmaßnahmen auf Schneefeldern einhalten.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
