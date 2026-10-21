import { 
  GpxTour, 
  WeatherCondition, 
  UserProfile, 
  GearItem, 
  PackingRecommendation, 
  BreakRecommendation 
} from '../types/app';

export function calculateEffectiveTemperature(
  valleyTempC: number,
  altitudeGainM: number,
  windKmh: number
): { summitTempC: number; windchillC: number } {
  // Standard atmospheric lapse rate in the Alps: ~0.65°C drop per 100m
  const altitudeDrop = (altitudeGainM / 100) * 0.65;
  const summitTempC = Math.round((valleyTempC - altitudeDrop) * 10) / 10;

  // Approximate windchill for outdoor conditions
  let windchillC = summitTempC;
  if (windKmh > 10) {
    windchillC = Math.round(
      (13.12 + 0.6215 * summitTempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * summitTempC * Math.pow(windKmh, 0.16)) * 10
    ) / 10;
  }

  return { summitTempC, windchillC };
}

export function generatePackingRecommendation(
  tour: GpxTour,
  weather: WeatherCondition,
  profile: UserProfile,
  closet: GearItem[]
): PackingRecommendation {
  const elevDiff = Math.max(0, tour.maxAltitudeM - tour.minAltitudeM);
  const { summitTempC, windchillC } = calculateEffectiveTemperature(weather.valleyTempC, elevDiff, weather.windKmh);

  // Check feedback history for learned preferences
  let coldBuffer = 0;
  let learnedNotice = '';
  const coldComplaints = profile.feedbackHistory.filter(f => f.tempFeeling === 'zu_kalt');
  const warmComplaints = profile.feedbackHistory.filter(f => f.tempFeeling === 'zu_warm');

  if (profile.coldSensitivity === 'frierend' || coldComplaints.length > 0) {
    coldBuffer = 4; // Shift target temps 4 degrees warmer
    learnedNotice = `Die App hat aus ${coldComplaints.length > 0 ? `${coldComplaints.length} Tour-Feedbacks` : 'deinem Profil'} gelernt: Du kühlst schneller aus. Es werden zusätzliche Isolationsschichten & Handwärmer priorisiert.`;
  } else if (profile.coldSensitivity === 'schwitzend' || warmComplaints.length > 0) {
    coldBuffer = -3;
    learnedNotice = `Die App hat gelernt: Du kommst schnell ins Schwitzen. Fokus auf hochgradig atmungsaktive Baselayer und leichtere Midlayer.`;
  }

  const effectiveFeltTemp = windchillC - coldBuffer;

  const wearOnBody: GearItem[] = [];
  const packInBackpack: GearItem[] = [];
  const mandatorySafety: Array<{ item: GearItem; reason: string; isHighAlert: boolean }> = [];
  const missingEssentialGear: string[] = [];

  // Helper to find best item in closet
  const findItem = (predicate: (g: GearItem) => boolean): GearItem | undefined => {
    return closet.find(predicate);
  };

  // 1. BASELAYER
  if (weather.valleyTempC > 18 && effectiveFeltTemp > 10) {
    const lightShirt = findItem(g => g.category === 'baselayer' && g.tempMax >= 20) || closet.find(g => g.category === 'baselayer');
    if (lightShirt) wearOnBody.push(lightShirt);
  } else {
    const merino = findItem(g => g.category === 'baselayer' && g.name.toLowerCase().includes('merino')) || closet.find(g => g.category === 'baselayer');
    if (merino) wearOnBody.push(merino);
  }

  // Always pack a dry spare baselayer for long tours (elevGain > 800m or duration > 4h)
  if (tour.elevationGainM > 800 || tour.estimatedHours > 4) {
    const spareShirt = closet.find(g => g.category === 'baselayer' && !wearOnBody.includes(g));
    if (spareShirt) {
      packInBackpack.push({ ...spareShirt, notes: 'Wechselshirt: Nach dem schweißtreibenden Aufstieg sofort wechseln!' });
    }
  }

  // 2. PANTS
  const pants = findItem(g => g.category === 'pants');
  if (pants) {
    wearOnBody.push(pants);
  }

  // 3. FOOTWEAR
  const isWinterOrHighAlpine = tour.sport === 'skitour' || tour.sport === 'snowshoe' || tour.maxAltitudeM > 2500 || tour.technicalDifficulty === 'T4' || tour.technicalDifficulty === 'T5';
  if (isWinterOrHighAlpine) {
    const mountaineeringBoot = findItem(g => g.category === 'footwear' && g.name.toLowerCase().includes('bergschuh')) || closet.find(g => g.category === 'footwear');
    if (mountaineeringBoot) wearOnBody.push(mountaineeringBoot);
  } else {
    const trailShoe = findItem(g => g.category === 'footwear' && g.sports.includes(tour.sport)) || closet.find(g => g.category === 'footwear');
    if (trailShoe) wearOnBody.push(trailShoe);
  }

  // 4. MIDLAYER & INSULATION
  if (effectiveFeltTemp < 14) {
    const fleece = findItem(g => g.category === 'midlayer' && g.name.toLowerCase().includes('fleece'));
    if (fleece) {
      if (weather.valleyTempC < 8) wearOnBody.push(fleece);
      else packInBackpack.push(fleece);
    }
  }

  if (effectiveFeltTemp < 6 || tour.maxAltitudeM > 2200 || coldBuffer > 0) {
    const downJacket = findItem(g => g.category === 'midlayer' && g.name.toLowerCase().includes('daune'));
    if (downJacket) {
      packInBackpack.push({
        ...downJacket,
        notes: 'Gipfel- und Rastisolation: Unbedingt bei längeren Pausen anziehen gegen Windchill!'
      });
    } else {
      missingEssentialGear.push('Packbare Daunen- oder Primaloft-Isolationsjacke (Gipfelkälte < 5°C)');
    }
  }

  // 5. HARDSHELL / RAIN PROTECTION
  const hardshell = findItem(g => g.category === 'hardshell' && g.isWaterproof);
  if (hardshell) {
    if (weather.precipitation === 'rain' || weather.precipitation === 'snow' || weather.windKmh > 50) {
      wearOnBody.push(hardshell);
    } else {
      packInBackpack.push({
        ...hardshell,
        notes: 'Wetterumschwung-Schutz: Im Hochgebirge auch bei Schönwetter Pflicht im Rucksack.'
      });
    }
  } else {
    missingEssentialGear.push('Wasserdichte Hardshelljacke (Alpiner Notfallschutz)');
  }

  // Rain pants if precipitation expected
  if (weather.precipitation === 'rain' || weather.precipitation === 'snow') {
    const rainPants = findItem(g => g.category === 'hardshell' && g.name.toLowerCase().includes('hose'));
    if (rainPants) packInBackpack.push(rainPants);
  }

  // 6. TECHNICAL HARDWARE
  // Snowshoes for snowshoeing
  if (tour.sport === 'snowshoe') {
    const snowshoes = findItem(g => g.name.toLowerCase().includes('schneeschuh'));
    if (snowshoes) wearOnBody.push(snowshoes);
    else missingEssentialGear.push('Schneeschuhe mit Harscheisen');
  }

  // Crampons / Grödel
  const hasIceOrSnow = tour.terrain.some(t => t.toLowerCase().includes('schnee') || t.toLowerCase().includes('eis') || t.toLowerCase().includes('gletscher'));
  if (hasIceOrSnow || tour.sport === 'mountaineering' || (weather.freezingAltitudeM < tour.maxAltitudeM && tour.sport === 'hiking')) {
    const crampons = findItem(g => g.name.toLowerCase().includes('steigeisen'));
    const spikes = findItem(g => g.name.toLowerCase().includes('grödel'));
    if (tour.technicalDifficulty === 'T4' || tour.technicalDifficulty === 'T5' || tour.maxAltitudeM > 2800) {
      if (crampons) packInBackpack.push(crampons);
      else missingEssentialGear.push('Steigeisen 10-Zacker für vereiste Flanken');
    } else if (spikes) {
      packInBackpack.push(spikes);
    }
  }

  // Via Ferrata Set & Helmet
  const isFerrataOrRocky = tour.sport === 'via_ferrata' || tour.technicalDifficulty === 'T5' || tour.terrain.some(t => t.toLowerCase().includes('grat') || t.toLowerCase().includes('drahtseil'));
  if (isFerrataOrRocky) {
    const ferrataSet = findItem(g => g.name.toLowerCase().includes('klettersteigset'));
    const helmet = findItem(g => g.name.toLowerCase().includes('helm'));
    if (ferrataSet) wearOnBody.push(ferrataSet);
    if (helmet) wearOnBody.push(helmet);
    else missingEssentialGear.push('Steinschlaghelm UIAA zertifiziert');
  }

  // 7. AVALANCHE & SAFETY GEAR (LAWINE)
  const isWinterActivity = tour.sport === 'skitour' || tour.sport === 'snowshoe' || hasIceOrSnow;
  const avalancheWarningActive = weather.avalancheLevel >= 2 || (isWinterActivity && weather.avalancheLevel >= 1);

  if (avalancheWarningActive) {
    const lvs = findItem(g => g.name.toLowerCase().includes('lvs'));
    const sonde = findItem(g => g.name.toLowerCase().includes('sonde'));
    const schaufel = findItem(g => g.name.toLowerCase().includes('schaufel'));

    if (lvs) {
      wearOnBody.push({ ...lvs, notes: 'LVS AM KÖRPER tragen (unterster Kleidungsschicht), eingeschaltet auf SENDEN!' });
      mandatorySafety.push({ item: lvs, reason: `Lawinengefahr Stufe ${weather.avalancheLevel} im Tourengebiet. LVS zwingend am Körper tragen!`, isHighAlert: true });
    } else {
      missingEssentialGear.push('Digitales 3-Antennen LVS-Gerät (Lebensrettend bei Lawinengefahr!)');
    }

    if (sonde) {
      packInBackpack.push(sonde);
      mandatorySafety.push({ item: sonde, reason: 'Lawinensonde 240cm+ für Punktortung im Schnee', isHighAlert: true });
    } else {
      missingEssentialGear.push('Lawinensonde Aluminium min. 240cm');
    }

    if (schaufel) {
      packInBackpack.push(schaufel);
      mandatorySafety.push({ item: schaufel, reason: 'Metall-Lawinenschaufel für Notfallausgrabung', isHighAlert: true });
    } else {
      missingEssentialGear.push('Stabile Lawinenschaufel mit Metallblatt');
    }
  }

  // Mandatory General Alpine Safety (First Aid, Bivy Bag, Headlamp)
  const firstAid = findItem(g => g.name.toLowerCase().includes('erste-hilfe') || g.name.toLowerCase().includes('notfall'));
  if (firstAid) {
    packInBackpack.push(firstAid);
    mandatorySafety.push({ item: firstAid, reason: 'Pflicht auf jeder Bergtour: Notfallversorgung & Rettungsdecke', isHighAlert: false });
  } else {
    missingEssentialGear.push('Alpine Notfalltasche / Erste-Hilfe-Set mit Rettungsdecke');
  }

  const bivyBag = findItem(g => g.name.toLowerCase().includes('biwaksack'));
  if (bivyBag && (tour.maxAltitudeM > 2000 || tour.estimatedHours > 4)) {
    packInBackpack.push(bivyBag);
    mandatorySafety.push({ item: bivyBag, reason: 'Alpines Notfallbiwak bei Wetterumsturz oder Verletzung', isHighAlert: false });
  }

  const headlamp = findItem(g => g.name.toLowerCase().includes('stirnlampe'));
  if (headlamp) {
    packInBackpack.push(headlamp);
    mandatorySafety.push({ item: headlamp, reason: 'Bei Verzögerung im Gebirge unverzichtbar', isHighAlert: false });
  }

  // 8. ACCESSORIES & HYDRATION
  // Sunglasses
  const sunglasses = findItem(g => g.category === 'accessories' && g.name.toLowerCase().includes('brille'));
  if (sunglasses) {
    if (isWinterOrHighAlpine || weather.precipitation === 'sun') wearOnBody.push(sunglasses);
    else packInBackpack.push(sunglasses);
  }

  // Gloves
  if (effectiveFeltTemp < 10 || windchillC < 5) {
    const lightGloves = findItem(g => g.name.toLowerCase().includes('fingerhandschuhe'));
    if (lightGloves) packInBackpack.push(lightGloves);
  }

  if (effectiveFeltTemp < 0 || isWinterActivity) {
    const heavyGloves = findItem(g => g.name.toLowerCase().includes('fausthandschuhe'));
    if (heavyGloves) packInBackpack.push(heavyGloves);
  }

  // Thermos or Water
  const thermos = findItem(g => g.name.toLowerCase().includes('thermos'));
  if (thermos && (effectiveFeltTemp < 8 || isWinterActivity)) {
    packInBackpack.push({ ...thermos, notes: 'Mit heißem Kräuter-/Ingwertee befüllen (ca. 1 Liter).' });
  }

  // 9. BREAKS & PACING STRATEGY
  const breaks: BreakRecommendation[] = [];
  const totalEle = tour.elevationGainM;
  const numBreaks = Math.max(1, Math.floor(tour.estimatedHours / 2));

  for (let i = 1; i <= numBreaks; i++) {
    const breakRatio = i / (numBreaks + 1);
    const breakKm = Math.round(tour.distanceKm * breakRatio * 10) / 10;
    const breakAlt = Math.round(tour.minAltitudeM + (totalEle * breakRatio));
    const isPeakBreak = i === Math.ceil(numBreaks / 2);

    breaks.push({
      km: breakKm,
      altitudeM: breakAlt,
      title: isPeakBreak ? `Gipfel- / Hauptpause (${breakAlt}m)` : `Trink- & Energierast #${i} (${breakAlt}m)`,
      timeEstimate: `ca. nach ${(tour.estimatedHours * breakRatio).toFixed(1)} Std. Gehzeit`,
      tip: isPeakBreak 
        ? 'Windgeschützte Mulde suchen. Ausgesetzte Grate meiden. Rundumblick genießen und Zeitplan für Abstieg prüfen.' 
        : 'Puls senken, tief atmen. Schuhe nachschnüren falls nötig.',
      clothingTip: isPeakBreak || windchillC < 10
        ? '⚠️ Daunenjacke oder Windjacke SOFORT überziehen, bevor der Schweiß verdunstet und Unterkühlung eintritt!'
        : 'Schicht öffnen oder Ärmel hochkrempeln, um Wärmestau zu vermeiden.',
      hydrationKcal: isPeakBreak 
        ? '300-400 ml Flüssigkeit + ca. 350 kcal (Vollkornbrot, Bergkäse, Nüsse)' 
        : '200 ml Elektrolytgetränk + 1 Energieriegel (ca. 150 kcal)'
    });
  }

  // Calculate total pack weight
  const totalWeightGrams = packInBackpack.reduce((acc, item) => acc + item.weightGrams, 0);
  const totalWeightKg = Math.round((totalWeightGrams / 1000) * 10) / 10;

  // Avalanche alert block if level >= 2
  let avalancheRiskAlert = undefined;
  if (weather.avalancheLevel >= 2) {
    const titles = [
      '',
      'Stufe 1 (Gering): Weitgehend sichere Verhältnisse',
      'Stufe 2 (Mäßig): Gefahrenstellen an Steilhängen beachten',
      'Stufe 3 (Erheblich): KRITISCH! Auslösung bereits durch geringe Zusatzbelastung wahrscheinlich',
      'Stufe 4 (Groß): AKUTE GEFAHR! Auf mäßig steiles Gelände (< 30°) beschränken',
      'Stufe 5 (Sehr groß): Katastrophale Lage! Keine Touren im freien Gelände!'
    ];
    avalancheRiskAlert = {
      level: weather.avalancheLevel,
      title: titles[weather.avalancheLevel],
      mandatoryChecklist: [
        'LVS-Gruppentest vor Tourstart am Parkplatz durchführen (Sende- & Empfangscheck)',
        'Lawinensonde & Metall-Schaufel im Rucksack griffbereit haben (nicht tief verpackt)',
        'Hangneigungen über 30° mit Hangneigungsmesser / Karte vorab analysieren',
        'Entlastungsabstände bei Aufstieg (10m) und Abfahrt (Einzeln fahren) einhalten'
      ]
    };
  }

  return {
    tour,
    weather,
    wearOnBody,
    packInBackpack,
    mandatorySafety,
    missingEssentialGear,
    breaks,
    totalWeightKg,
    avalancheRiskAlert,
    adaptiveLearningNote: learnedNotice || undefined
  };
}
