import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Thermometer, 
  Weight, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GpxTour, TourFeedback, UserProfile } from '../types/app';

interface FeedbackLearningViewProps {
  userProfile: UserProfile;
  tours: GpxTour[];
  onAddFeedback: (feedback: TourFeedback) => void;
  onGoToAdvisor: () => void;
}

export const FeedbackLearningView: React.FC<FeedbackLearningViewProps> = ({
  userProfile,
  tours,
  onAddFeedback,
  onGoToAdvisor
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(tours[0]?.id || '');
  const [tempFeeling, setTempFeeling] = useState<'zu_kalt' | 'genau_richtig' | 'zu_warm'>('zu_kalt');
  const [weightRating, setWeightRating] = useState<'zu_schwer' | 'optimal' | 'leicht'>('optimal');
  const [gearMissedText, setGearMissedText] = useState('');
  const [gearUnusedText, setGearUnusedText] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tour = tours.find(t => t.id === selectedTourId) || tours[0];

    const newFeedback: TourFeedback = {
      id: `fb-${Date.now()}`,
      tourId: tour.id,
      tourName: tour.name,
      date: new Date().toISOString().split('T')[0],
      tempFeeling,
      weightRating,
      gearMissed: gearMissedText.split(',').map(s => s.trim()).filter(Boolean),
      gearUnused: gearUnusedText.split(',').map(s => s.trim()).filter(Boolean),
      notes: notes.trim()
    };

    onAddFeedback(newFeedback);
    setGearMissedText('');
    setGearUnusedText('');
    setNotes('');
    setIsAdding(false);
  };

  const coldCount = userProfile.feedbackHistory.filter(f => f.tempFeeling === 'zu_kalt').length;
  const warmCount = userProfile.feedbackHistory.filter(f => f.tempFeeling === 'zu_warm').length;

  return (
    <div className="space-y-6 py-2">
      {/* Intro & Machine Learning explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Adaptives Tour-Lernen & Feedback-Loop
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
              Wie die App aus deinen Erfahrungen lernt
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Jeder Mensch hat ein anderes Kälte- und Wärmeempfinden. Sobald du nach einer Tour Feedback gibst 
              (z.B. "Am Grat bei 4°C gefroren"), passt der Empfehlungs-Algorithmus zukünftige Packlisten automatisch an: 
              wärmere Midlayer, zusätzliche Windstopper oder leichtere Alternativen.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex-shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tour-Feedback erfassen</span>
          </button>
        </div>

        {/* Learning Status Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Erfasste Tour-Erfahrungen</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {userProfile.feedbackHistory.length} Berichte
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Kälte-Profil</span>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">
              {coldCount > 0 ? `${coldCount}x zu kalt gemeldet` : 'Ausgewogen'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {coldCount > 0 ? '+4°C Sicherheits-Wärmepuffer aktiv' : 'Standard-Formel'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Aktives Benutzerprofil</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {userProfile.name}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {userProfile.coldSensitivity} · {userProfile.safetyPriority}
            </div>
          </div>
        </div>
      </div>

      {/* Add Feedback Form */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Neues Tour-Feedback erfassen
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Abbrechen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gegangene Tour</label>
              <select
                value={selectedTourId}
                onChange={e => setSelectedTourId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {tours.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.distanceKm}km)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Temperatur-Gefühl</label>
              <select
                value={tempFeeling}
                onChange={e => setTempFeeling(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="zu_kalt">🥶 Zu kalt (gefroren / Windchill unterschätzt)</option>
                <option value="genau_richtig">👌 Genau richtig / perfekt temperiert</option>
                <option value="zu_warm">🥵 Zu warm (überhitzt / stark geschwitzt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Rucksack-Gewicht Beurteilung</label>
              <select
                value={weightRating}
                onChange={e => setWeightRating(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="zu_schwer">Zu schwer (Übergepäck / unnötiger Ballast)</option>
                <option value="optimal">Optimal / angenehm zu tragen</option>
                <option value="leicht">Sehr leicht / ultralight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hat Ausrüstung gefehlt? (Kommagetrennt)
              </label>
              <input
                type="text"
                placeholder="z.B. Grödel, winddichte Handschuhe, Mütze"
                value={gearMissedText}
                onChange={e => setGearMissedText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unbenutzte Teile (Was war überflüssig?)
              </label>
              <input
                type="text"
                placeholder="z.B. 2. Fleecejacke, Ersatzhose"
                value={gearUnusedText}
                onChange={e => setGearUnusedText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Persönliche Notizen & Erkenntnisse
              </label>
              <textarea
                rows={2}
                placeholder="z.B. Am Grat zog es extrem bei 60 km/h Wind. Daunenjacke hat mich gerettet..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
            >
              Feedback speichern & Modell anpassen
            </button>
          </div>
        </form>
      )}

      {/* History Feed */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Bisherige Feedback-Einträge
        </div>

        {userProfile.feedbackHistory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
            Noch kein Feedback hinterlegt. Erfasse oben deine erste Tour!
          </div>
        ) : (
          userProfile.feedbackHistory.map(fb => (
            <div
              key={fb.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h4 className="text-sm font-bold text-white">{fb.tourName}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">{fb.date}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    fb.tempFeeling === 'zu_kalt' 
                      ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                      : fb.tempFeeling === 'zu_warm' 
                      ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {fb.tempFeeling === 'zu_kalt' ? '🥶 Zu kalt' : fb.tempFeeling === 'zu_warm' ? '🥵 Zu warm' : '👌 Genau richtig'}
                  </span>
                </div>
              </div>

              {fb.notes && (
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{fb.notes}"
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1 font-mono">
                {fb.gearMissed.length > 0 && (
                  <div>
                    <span className="text-rose-400 font-sans font-bold">Gefehlt:</span> {fb.gearMissed.join(', ')}
                  </div>
                )}
                {fb.gearUnused.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-sans font-bold">Unbenutzt:</span> {fb.gearUnused.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
