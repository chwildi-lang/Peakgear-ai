import { GpxTour, ProfilePoint, SportType } from '../types/app';

// Haversine formula for distance between 2 GPS coordinates in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parseGpxFile(gpxString: string, fileName: string): GpxTour {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxString, 'text/xml');

  // Try to find tour name from GPX metadata or trk name
  const nameElement = xmlDoc.querySelector('trk > name') || xmlDoc.querySelector('metadata > name');
  const tourName = nameElement?.textContent?.trim() || fileName.replace(/\.gpx$/i, '');

  const trkpts = Array.from(xmlDoc.querySelectorAll('trkpt'));

  if (trkpts.length === 0) {
    throw new Error('Keine Trackpunkte (<trkpt>) in der GPX-Datei gefunden.');
  }

  let totalDistKm = 0;
  let eleGainM = 0;
  let eleLossM = 0;
  let minAlt = Infinity;
  let maxAlt = -Infinity;

  const sampledProfilePoints: ProfilePoint[] = [];
  let prevLat: number | null = null;
  let prevLon: number | null = null;
  let prevEle: number | null = null;

  // Sample roughly 20-30 points for smooth elevation SVG chart
  const sampleInterval = Math.max(1, Math.floor(trkpts.length / 25));

  trkpts.forEach((pt, index) => {
    const lat = parseFloat(pt.getAttribute('lat') || '0');
    const lon = parseFloat(pt.getAttribute('lon') || '0');
    const eleNode = pt.querySelector('ele');
    const ele = eleNode && eleNode.textContent ? parseFloat(eleNode.textContent) : 1000;

    if (ele < minAlt) minAlt = ele;
    if (ele > maxAlt) maxAlt = ele;

    if (prevLat !== null && prevLon !== null && prevEle !== null) {
      const segDist = calculateDistanceKm(prevLat, prevLon, lat, lon);
      totalDistKm += segDist;

      const eleDiff = ele - prevEle;
      if (eleDiff > 0.8) {
        eleGainM += eleDiff;
      } else if (eleDiff < -0.8) {
        eleLossM += Math.abs(eleDiff);
      }
    }

    if (index % sampleInterval === 0 || index === trkpts.length - 1) {
      sampledProfilePoints.push({
        distKm: Math.round(totalDistKm * 10) / 10,
        altitudeM: Math.round(ele)
      });
    }

    prevLat = lat;
    prevLon = lon;
    prevEle = ele;
  });

  // Mountain time estimation according to Swiss Alpine Club (SAC) formula
  // h = (km / 4) + (hm / 400)
  const estimatedHours = Math.round(((totalDistKm / 4.0) + (eleGainM / 400)) * 10) / 10;

  // Guess sport based on elevation & name keywords
  let sport: SportType = 'hiking';
  const lowerName = tourName.toLowerCase();
  if (lowerName.includes('ski') || lowerName.includes('buin') || lowerName.includes('kar')) {
    sport = 'skitour';
  } else if (lowerName.includes('schnee') || lowerName.includes('winter')) {
    sport = 'snowshoe';
  } else if (lowerName.includes('trail') || lowerName.includes('run')) {
    sport = 'trailrunning';
  } else if (lowerName.includes('steig') || lowerName.includes('ferrata')) {
    sport = 'via_ferrata';
  } else if (maxAlt > 2500 || eleGainM > 1500) {
    sport = 'mountaineering';
  }

  // Difficulty estimation
  let technicalDifficulty: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' = 'T2';
  if (maxAlt > 3000 || sport === 'skitour') technicalDifficulty = 'T4';
  else if (maxAlt > 2500 || sport === 'mountaineering') technicalDifficulty = 'T4';
  else if (eleGainM > 1000 || totalDistKm > 15) technicalDifficulty = 'T3';

  return {
    id: `custom-gpx-${Date.now()}`,
    name: tourName,
    sport,
    region: 'Importierte GPX Route',
    distanceKm: Math.round(totalDistKm * 10) / 10,
    elevationGainM: Math.round(eleGainM),
    elevationLossM: Math.round(eleLossM),
    maxAltitudeM: Math.round(maxAlt),
    minAltitudeM: Math.round(minAlt),
    estimatedHours,
    technicalDifficulty,
    terrain: maxAlt > 2500 ? ['Fels', 'Schotter', 'Grat'] : ['Alpinpfad', 'Mischgelände'],
    description: `Aus GPX-Trackdatei "${fileName}" extrahiert. ${trkpts.length} Trackpunkte verarbeitet.`,
    profilePoints: sampledProfilePoints,
    gpxRaw: gpxString
  };
}
