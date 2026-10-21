import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Coffee, 
  Sparkles, 
  Weight, 
  Thermometer, 
  AlertTriangle, 
  Shirt, 
  Backpack, 
  Info,
  Clock,
  Compass,
  Zap,
  ArrowRight,
  Star
} from 'lucide-react';
import { PackingRecommendation, GearItem } from '../types/app';
import { WeatherSimulationBar } from './WeatherSimulationBar';

interface PackAdvisorViewProps {
  recommendation: PackingRecommendation;
  weather: any;
  setWeather: any;
  onGoToFeedback: () => void;
  onGoToCloset: () => void;
  onFetchGoogleSearchWeather?: () => Promise<void>;
  isLoadingWeather?: boolean;
}

export const PackAdvisorView: React.FC<PackAdvisorViewProps> = ({
  recommendation,
  weather,
  setWeather,
  onGoToFeedback,
  onGoToCloset,
  onFetchGoogleSearchWeather,
  isLoadingWeather
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const {
    tour,
    wearOnBody,
    packInBackpack,
    mandatorySafety,
    missingEssentialGear,
    breaks,
    totalWeightKg,
    avalancheRiskAlert,
    adaptiveLearningNote
  } = recommendation;

  const totalPackItems = wearOnBody.length + packInBackpack.length;
  const packedCount = [...wearOnBody, ...packInBackpack].filter(i => !!checkedItems[i.id]).length;

  return (
    <div className="space-y-8 py-2">
      {/* Weather Simulation Control at Top of Advisor */}
      <WeatherSimulationBar
        weather={weather}
        setWeather={setWeather}
        elevationGainM={tour.elevationGainM}
        maxAltitudeM={tour.maxAltitudeM}
        tour={tour}
        onFetchGoogleSearchWeather={onFetchGoogleSearchWeather}
        isLoadingWeather={isLoadingWeather}
      />

      {/* Adaptive Learning Banner if feedback was incorporated */}
      {adaptiveLearningNote && (
        <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Adaptives Profil-Lernen aktiv
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {adaptiveLearningNote}
            </p>
          </div>
          <button
            onClick={onGoToFeedback}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer flex-shrink-0"
          >
            Feedback einsehen
          </button>
        </div>
      )}

      {/* Avalanche Critical Warning Banner (If Level >= 2) */}
      {avalancheRiskAlert && (
        <div className="bg-rose-950/40 border-2 border-rose-600/70 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 font-mono">
                  Sicherheitswarnung Hochgebirge
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {avalancheRiskAlert.title}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-rose-300 bg-rose-900/60 px-2.5 py-1 rounded-md border border-rose-700">
                Gefahrenstufe {avalancheRiskAlert.level} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-rose-800/40">
            {avalancheRiskAlert.mandatoryChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-rose-200/90">
                <span className="text-rose-400 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Gear Warning Alert */}
      {missingEssentialGear.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-600/50 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Achtung: Kritische Ausrüstung fehlt in deinem Schrank!</span>
            </div>
            <button
              onClick={onGoToCloset}
              className="text-xs text-amber-300 hover:text-white underline"
            >
              Im Ausrüstungsschrank erfassen
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Für die gewählte Tour und Wetterlage solltest du folgende Gegenstände dringend ergänzen oder ausleihen:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {missingEssentialGear.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Packing Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Packliste für {tour.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geplante Gehzeit: ~{tour.estimatedHours}h · Gipfelhöhe: {tour.maxAltitudeM}m ü. M.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Weight className="w-4 h-4 text-emerald-400" />
            <span>Rucksackgewicht: <strong className="text-white font-mono">{totalWeightKg} kg</strong></span>
          </div>

          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            Gepackt: <strong className="text-emerald-400 font-mono">{packedCount}</strong> von {totalPackItems}
          </div>
        </div>
      </div>

      {/* Section 1: Wear on Body (Am Körper beim Start) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shirt className="w-4 h-4 text-emerald-400" />
            1. Direkt am Körper anziehen (Start & Aufstieg)
          </h3>
          <span className="text-xs text-slate-500">{wearOnBody.length} Teile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wearOnBody.map(item => renderGearCard(item, true))}
        </div>
      </div>

      {/* Section 2: Pack in Backpack (Im Rucksack mitführen) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Backpack className="w-4 h-4 text-indigo-400" />
            2. Im Rucksack mitführen (Isolation, Wetterschutz & Hardware)
          </h3>
          <span className="text-xs text-slate-500">{packInBackpack.length} Teile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packInBackpack.map(item => renderGearCard(item, false))}
        </div>
      </div>

      {/* Section 3: Breaks, Pacing & Nutrition Tips */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Coffee className="w-4 h-4" />
              Pausen-Taktik & Verpflegungs-Strategie
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimale Rastpunkte basierend auf Höhenmetern, Anstrengung und Auskühlungsrisiko.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{breaks.length} Pausen empfohlen</span>
        </div>

        <div className="space-y-3">
          {breaks.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {b.timeEstimate} · km {b.km}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <strong className="text-slate-300">Taktik: </strong>
                  <span className="text-slate-400">{b.tip}</span>
                </div>
                <div>
                  <strong className="text-amber-400">Kleidung: </strong>
                  <span className="text-slate-300">{b.clothingTip}</span>
                </div>
                <div className="md:col-span-2 pt-1 border-t border-slate-800/50 flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400 font-bold">Verpflegung:</span>
                  <span>{b.hydrationKcal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function renderGearCard(item: GearItem, isWorn: boolean) {
    const isChecked = !!checkedItems[item.id];

    return (
      <div
        key={item.id}
        onClick={() => toggleCheck(item.id)}
        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
          isChecked
            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
            : isWorn
            ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
            : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
        }`}
      >
        <button
          type="button"
          className="mt-0.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          {isChecked ? (
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          ) : (
            <Square className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className={`text-sm font-semibold truncate ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
              {item.name}
            </h5>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-medium">{item.brand}</span>
            {item.isFavorite && (
              <span className="text-xs text-amber-400 flex items-center gap-1 font-medium" title="Go-to Favorit">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Favorit</span>
              </span>
            )}
            {item.isMandatorySafety && (
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800">
                Sicherheitspflicht
              </span>
            )}
          </div>

          {item.notes && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {item.notes}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
            <span>{item.weightGrams}g</span>
            <span>·</span>
            <span>{item.tempMin}°C bis {item.tempMax}°C</span>
            {item.isWaterproof && (
              <>
                <span>·</span>
                <span className="text-cyan-400">Wasserdicht</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};
