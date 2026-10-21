import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Plus, 
  Check, 
  ShieldCheck, 
  Thermometer, 
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types/app';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [coldSensitivity, setColdSensitivity] = useState<'frierend' | 'normal' | 'schwitzend'>('normal');
  const [safetyPriority, setSafetyPriority] = useState<'ultralight' | 'ausgewogen' | 'sicherheit_zuerst'>('ausgewogen');
  const [experienceLevel, setExperienceLevel] = useState<'Einsteiger' | 'Fortgeschritten' | 'Alpinist'>('Fortgeschritten');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      coldSensitivity,
      safetyPriority,
      experienceLevel,
      feedbackHistory: []
    };

    onAddProfile(newProfile);
    onSelectProfile(newProfile.id);
    setName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Benutzerkonten & persönliche Profile
              </h3>
              <p className="text-xs text-slate-400">
                Verwalte persönliche Kälteempfindlichkeiten & Vorlieben für Partner und Freunde.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile List */}
        <div className="space-y-2.5">
          {profiles.map(p => {
            const isActive = p.id === activeProfileId;

            return (
              <div
                key={p.id}
                onClick={() => { onSelectProfile(p.id); onClose(); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                        Aktiv
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="capitalize">Empfinden: {p.coldSensitivity}</span>
                    <span>·</span>
                    <span>Level: {p.experienceLevel}</span>
                  </div>
                </div>

                <div className="text-emerald-400">
                  {isActive ? <Check className="w-5 h-5 stroke-[3]" /> : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Profile Toggle */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Neues Benutzerkonto / Profil anlegen</span>
          </button>
        ) : (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Neues Profil konfigurieren
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Name *</label>
              <input
                type="text"
                required
                placeholder="z.B. Sarah oder Bergsteiger Max"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kälteempfinden</label>
                <select
                  value={coldSensitivity}
                  onChange={e => setColdSensitivity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="frierend">Kälteempfindlich (friert schnell)</option>
                  <option value="normal">Normal / Standard</option>
                  <option value="schwitzend">Wärmeempfindlich (schwitzt schnell)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Erfahrungsgrad</label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Einsteiger">Einsteiger</option>
                  <option value="Fortgeschritten">Fortgeschritten</option>
                  <option value="Alpinist">Alpinist / Profi</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
              >
                Konto speichern
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
