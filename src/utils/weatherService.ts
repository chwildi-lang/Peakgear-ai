import { GpxTour, WeatherCondition } from '../types/app';

/**
 * Ruft aktuelle Wetter- und Lawinendaten via Google Search ab
 * und aktualisiert das WeatherCondition State-Objekt.
 */
export async function fetchLiveWeatherForTour(
  tour: GpxTour,
  currentWeather: WeatherCondition
): Promise<WeatherCondition> {
  const response = await fetch('/api/fetch-live-weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      region: tour.region,
      tourName: tour.name,
      maxAltitudeM: tour.maxAltitudeM
    })
  });

  const json = await response.json();
  if (json.success && json.data) {
    const d = json.data;
    const now = new Date();
    const timeStr = `Heute, ${now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;

    return {
      ...currentWeather,
      valleyTempC: d.valleyTempC,
      mountainTempC: d.mountainTempC,
      windKmh: d.windKmh,
      precipitation: d.precipitation,
      avalancheLevel: d.avalancheLevel,
      avalancheWarning: d.avalancheWarning,
      freezingAltitudeM: d.freezingAltitudeM,
      regionName: tour.region,
      fetchedViaGoogleSearch: true,
      lastUpdated: timeStr,
      searchSummary: d.searchSummary,
      searchSources: d.searchSources || ['Google Search'],
      isLiveLoading: false
    };
  }

  throw new Error('Wetterdaten konnten nicht geladen werden.');
}
