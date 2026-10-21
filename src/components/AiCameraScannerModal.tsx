import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Weight,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { GearItem } from '../types/app';

interface AiCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGearItem: (item: GearItem) => void;
}

export const AiCameraScannerModal: React.FC<AiCameraScannerModalProps> = ({
  isOpen,
  onClose,
  onAddGearItem
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<Partial<GearItem> | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      setScannedResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-gear-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedImage || '',
          hint: hint.trim()
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setScannedResult(json.data);
        setSourceInfo(json.source);
      } else {
        throw new Error('Analyse konnte nicht durchgeführt werden.');
      }
    } catch (err: any) {
      setError(err.message || 'Verbindung zum KI-Dienst fehlgeschlagen.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!scannedResult || !scannedResult.name) return;

    const newItem: GearItem = {
      id: `gear-ai-${Date.now()}`,
      name: scannedResult.name || 'Gescannte Ausrüstung',
      brand: scannedResult.brand || 'Outdoor',
      category: scannedResult.category as any || 'baselayer',
      weightGrams: scannedResult.weightGrams || 300,
      tempMin: scannedResult.tempMin !== undefined ? scannedResult.tempMin : -5,
      tempMax: scannedResult.tempMax !== undefined ? scannedResult.tempMax : 15,
      isWaterproof: !!scannedResult.isWaterproof,
      isWindproof: !!scannedResult.isWindproof,
      sports: scannedResult.sports || ['hiking', 'mountaineering'],
      condition: 'Sehr gut',
      isMandatorySafety: !!scannedResult.isMandatorySafety,
      notes: scannedResult.notes || 'Erkannt via KI-Kamera-Scan.',
      imageSrc: capturedImage || undefined
    };

    onAddGearItem(newItem);
    onClose();
  };

  const handleResetScan = () => {
    setCapturedImage(null);
    setScannedResult(null);
    setHint('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                KI-Kamera Ausrüstungs- & Bekleidungs-Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Fotografiere ein Kleidungsstück, Etikett oder Equipment für automatische Erkennung.
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

        {/* Image Capture / Selection */}
        {!capturedImage ? (
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFile}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Kamera öffnen oder Foto auswählen
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unterstützt JPG, PNG, WEBP (Smartphone Kamera oder Datei-Upload)
                </p>
              </div>
            </div>

            {/* Quick Demo Previews */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-medium">Oder wähle ein typisches alpines Testobjekt:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Mammut Hardshelljacke', hint: 'Gore-Tex Hardshell Jacke Nordwand' },
                  { label: 'Barryvox LVS-Gerät', hint: 'Ortovox Mammut LVS-Gerät 3-Antennen' },
                  { label: 'Icebreaker Merinoshirt', hint: 'Merino 200 Baselayer Unterwäsche' },
                  { label: 'Petzl Steigeisen', hint: 'Petzl Vasak Leichtsteigeisen 10-Zack' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setHint(sample.hint);
                      // Use a clean placeholder base64
                      setCapturedImage('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23818cf8" font-family="sans-serif" font-size="16">' + sample.label + '</text></svg>');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Captured Image Preview & Analysis */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative">
                <img
                  src={capturedImage}
                  alt="Ausrüstung Foto"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleResetScan}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white text-xs flex items-center gap-1 shadow"
                  title="Anderes Foto wählen"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Zusätzlicher Hinweis / Typ (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Mammut Jacke Gore-Tex oder Petzl Steigeisen..."
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini KI analysiert Material, Gewicht & Kategorie...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Jetzt mit KI analysieren & Daten ergänzen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* AI Scanned Result View */}
            {scannedResult && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-emerald-300">
                      Erfolgreich von KI erkannt {sourceInfo ? `(${sourceInfo})` : ''}
                    </span>
                  </div>
                  {scannedResult.isMandatorySafety && (
                    <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                      Sicherheitsrelevant
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Artikel:</span>
                    <div className="font-bold text-white text-sm mt-0.5">{scannedResult.name}</div>
                  </div>

                  <div>
                    <span className="text-slate-500">Marke & Kategorie:</span>
                    <div className="font-medium text-emerald-400 mt-0.5">
                      {scannedResult.brand} · <span className="capitalize">{scannedResult.category}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500">Geschätztes Gewicht:</span>
                    <div className="font-mono text-white mt-0.5">{scannedResult.weightGrams} Gramm</div>
                  </div>

                  <div>
                    <span className="text-slate-500">Komfort-Temperatur:</span>
                    <div className="font-mono text-white mt-0.5">
                      {scannedResult.tempMin}°C bis {scannedResult.tempMax}°C
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Wetterschutz & Eigenschaften:</span>
                    <div className="flex items-center gap-3 mt-1 text-slate-300">
                      {scannedResult.isWaterproof && <span className="text-cyan-400 font-medium">✓ Wasserdicht</span>}
                      {scannedResult.isWindproof && <span className="text-indigo-400 font-medium">✓ Winddicht</span>}
                      <span>Zustand: {scannedResult.condition}</span>
                    </div>
                  </div>

                  {scannedResult.notes && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-800/80 text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">KI-Expertentipp: </strong>
                      {scannedResult.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmAndAdd}
                  className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Diesen Artikel in den Ausrüstungsschrank übernehmen</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
