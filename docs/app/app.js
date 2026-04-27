/* Tap FIFA — Atlanta 2026 · Wilkins Media Guest OS
   Self-contained guest app: i18n (10 langs), live map (Leaflet/OSM),
   hotel→seat routing (OSRM public), emergency, sponsor/POS slot.
   No backend required. Works offline after first load via sw.js.
*/

// =========================================================
// 1. ATLANTA VENUE DATA (POIs)
// =========================================================
const STADIUM = {
  id: 'stadium',
  name: 'Mercedes-Benz Stadium',
  lat: 33.7553,
  lng: -84.4006,
  type: 'stadium'
};

const GATES = [
  { id: 'gate-a', name: 'Gate A · Northeast', lat: 33.7560, lng: -84.3998, seat: 'Sections 100–115' },
  { id: 'gate-b', name: 'Gate B · East',      lat: 33.7553, lng: -84.3994, seat: 'Sections 116–125 / Suites' },
  { id: 'gate-c', name: 'Gate C · Southeast', lat: 33.7547, lng: -84.3998, seat: 'Sections 126–135' },
  { id: 'gate-d', name: 'Gate D · South',     lat: 33.7546, lng: -84.4006, seat: 'Sections 136–145' },
  { id: 'gate-e', name: 'Gate E · Southwest', lat: 33.7547, lng: -84.4014, seat: 'Sections 146–155' },
  { id: 'gate-f', name: 'Gate F · West',      lat: 33.7553, lng: -84.4018, seat: 'Sections 156–165 / Premium' },
  { id: 'gate-g', name: 'Gate G · Northwest', lat: 33.7560, lng: -84.4014, seat: 'Sections 166–175' },
  { id: 'gate-h', name: 'Gate H · North',     lat: 33.7561, lng: -84.4006, seat: 'Sections 176–185 / Family' }
];

const HOTELS = [
  { id: 'omni',    name: 'Omni Atlanta CNN Center',          lat: 33.7595, lng: -84.3947 },
  { id: 'marriott',name: 'Atlanta Marriott Marquis',         lat: 33.7615, lng: -84.3855 },
  { id: 'hyatt',   name: 'Hyatt Regency Atlanta',            lat: 33.7600, lng: -84.3870 },
  { id: 'westin',  name: 'The Westin Peachtree Plaza',       lat: 33.7589, lng: -84.3870 },
  { id: 'hilton',  name: 'Hilton Atlanta',                   lat: 33.7615, lng: -84.3850 },
  { id: 'fourS',   name: 'Four Seasons Atlanta (Midtown)',   lat: 33.7825, lng: -84.3848 },
  { id: 'glenn',   name: 'The Glenn Hotel · Downtown',       lat: 33.7563, lng: -84.3923 },
  { id: 'ellis',   name: 'Ellis Hotel · Peachtree',          lat: 33.7589, lng: -84.3856 },
  { id: 'aloft',   name: 'Aloft Atlanta Downtown',           lat: 33.7639, lng: -84.3902 },
  { id: 'embassy', name: 'Embassy Suites Centennial Olympic',lat: 33.7625, lng: -84.3935 }
];

const MARTA_HUBS = [
  { id: 'gwcc',     name: 'GWCC / CNN Center MARTA',  lat: 33.7596, lng: -84.3948 },
  { id: 'fivepts',  name: 'Five Points Station',      lat: 33.7538, lng: -84.3915 },
  { id: 'peachtree',name: 'Peachtree Center',         lat: 33.7595, lng: -84.3870 },
  { id: 'vine',     name: 'Vine City',                lat: 33.7567, lng: -84.4039 }
];

const SAFE_PINS = [
  { id: 'lost-100', name: '🆘 Lost-Person Station — Concourse 100', lat: 33.7551, lng: -84.4008 },
  { id: 'lost-200', name: '🆘 Lost-Person Station — Concourse 200', lat: 33.7556, lng: -84.4002 },
  { id: 'safe-vine',name: '🛡️ Safe-Zone — Vine City Plaza',         lat: 33.7569, lng: -84.4030 },
  { id: 'safe-cnn', name: '🛡️ Safe-Zone — CNN Center Lobby',        lat: 33.7593, lng: -84.3950 }
];

// Unicorn waypoints — visible mascot beacons families/kids can follow
const UNICORN_PINS = [
  { id:'uc-gateA',  name:'Tap Safety Beacon — Gate A',         lat:33.7560, lng:-84.4012 },
  { id:'uc-gateD',  name:'Tap Safety Beacon — Gate D',         lat:33.7548, lng:-84.4001 },
  { id:'uc-rides',  name:'Verified Pickup Zone — West Lot',      lat:33.7553, lng:-84.4040 },
  { id:'uc-marta',  name:'Tap Safety Greeter — Five Points',     lat:33.7540, lng:-84.3915 },
  { id:'uc-airport',name:'Tap Safety Greeter — ATL Arrivals',    lat:33.6407, lng:-84.4277 }
];

// =========================================================
// 2. I18N — 10 languages, full translation
// =========================================================
const I18N = {
  en:{__name:'English',__flag:'🇺🇸',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Welcome',
    heroSub:'Live multilingual guest support, safety, and wayfinding for FIFA Atlanta.',
    sosT:'Emergency — Tap to call 911',
    sosS:'Always works · GPS sent to staff',
    iFood:'Food from home', iFoodS:'Cultural cuisine near you',
    iRoute:'Hotel → Seat',  iRouteS:'Door-to-door directions',
    iRewards:'My rewards',  iRewardsS:'Badges & perks',
    iPhrases:'Safety phrases', iPhrasesS:'10 languages',
    spnCta:'Activate',
    mapT:'Hotel → Seat Wayfinding', mapLive:'LIVE',
    from:'From (hotel)', to:'To (gate / seat)',
    routeBtn:'Get directions',
    numbersH:'Safety & Help · 24/7',
    n911:'Police · Fire · Medical', n911S:'Life-safety emergency',
    nNHTH:'National Trafficking Hotline', nNHTHS:'Voice · 200+ languages',
    nBeFree:'Text "HELP" to BeFree', nBeFreeS:'Confidential SMS support',
    nWilkins:'Wilkins Safe Line', nWilkinsS:'10-language fan support',
    nPoison:'Poison Control', nPoisonS:'Free · 24/7',
    nCrisis:'Suicide & Crisis Lifeline', nCrisisS:'Voice · Text · Chat',
    nApd:'Atlanta Police (Non-Emergency)', nApdS:'Reports · Lost & found',
    nMarta:'MARTA Customer Service', nMartaS:'Transit info · Lost items',
    install:'Add to Home Screen for instant offline access — Share menu → Add to Home Screen.',
    footMain:'<strong>Tap FIFA</strong> by Wilkins Media × FTH Trading',
    footSub:'Built for Atlanta · FIFA World Cup 2026 · Safety always overrides sponsor logic.',
    phraseH:'Emergency Phrases', phraseSub:'Show this screen to staff or police.',
    routeMins:'min walk + transit · {dist} km',
    spnT:'MARTA Free Match-Day Pass', spnP:'Tap to scan · Skip the line at Five Points'
  },
  es:{__name:'Español',__flag:'🇪🇸',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Bienvenido',
    heroSub:'Asistencia multilingüe en vivo, seguridad y orientación para la FIFA Atlanta.',
    sosT:'Emergencia — Toque para llamar al 911',
    sosS:'Siempre funciona · GPS enviado al personal',
    iFood:'Comida de casa', iFoodS:'Cocina cultural cerca de ti',
    iRoute:'Hotel → Asiento', iRouteS:'Indicaciones puerta a puerta',
    iRewards:'Mis recompensas', iRewardsS:'Insignias y beneficios',
    iPhrases:'Frases de seguridad', iPhrasesS:'10 idiomas',
    spnCta:'Activar',
    mapT:'Ruta Hotel → Asiento', mapLive:'EN VIVO',
    from:'Desde (hotel)', to:'Hasta (puerta / asiento)',
    routeBtn:'Obtener indicaciones',
    numbersH:'Seguridad y Ayuda · 24/7',
    n911:'Policía · Bomberos · Médico', n911S:'Emergencia de vida',
    nNHTH:'Línea Nacional contra la Trata', nNHTHS:'Voz · 200+ idiomas',
    nBeFree:'Envíe "HELP" a BeFree', nBeFreeS:'Apoyo confidencial por SMS',
    nWilkins:'Línea Segura Wilkins', nWilkinsS:'Soporte en 10 idiomas',
    nPoison:'Control de Envenenamiento', nPoisonS:'Gratis · 24/7',
    nCrisis:'Línea de Crisis y Suicidio', nCrisisS:'Voz · Texto · Chat',
    nApd:'Policía de Atlanta (No-Emergencia)', nApdS:'Reportes · Objetos perdidos',
    nMarta:'Servicio al Cliente MARTA', nMartaS:'Info de tránsito · Objetos',
    install:'Agréguelo a la pantalla de inicio para acceso sin conexión.',
    footMain:'<strong>Tap FIFA</strong> por Wilkins Media × FTH Trading',
    footSub:'Hecho para Atlanta · Copa Mundial 2026 · La seguridad siempre prevalece.',
    phraseH:'Frases de Emergencia', phraseSub:'Muestre esta pantalla al personal o la policía.',
    routeMins:'min caminando + tránsito · {dist} km',
    spnT:'Pase MARTA Gratis Día de Partido', spnP:'Toque para escanear · Salte la fila en Five Points'
  },
  pt:{__name:'Português',__flag:'🇧🇷',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Bem-vindo',
    heroSub:'Suporte multilíngue ao vivo, segurança e orientação para a FIFA Atlanta.',
    sosT:'Emergência — Toque para ligar 911',
    sosS:'Sempre funciona · GPS enviado à equipe',
    iFood:'Comida de casa', iFoodS:'Culinária cultural perto de você',
    iRoute:'Hotel → Assento', iRouteS:'Direções porta a porta',
    iRewards:'Minhas recompensas', iRewardsS:'Distintivos e benefícios',
    iPhrases:'Frases de segurança', iPhrasesS:'10 idiomas',
    spnCta:'Ativar',
    mapT:'Rota Hotel → Assento', mapLive:'AO VIVO',
    from:'De (hotel)', to:'Para (portão / assento)',
    routeBtn:'Obter direções',
    numbersH:'Segurança e Ajuda · 24/7',
    n911:'Polícia · Bombeiros · Médico', n911S:'Emergência de vida',
    nNHTH:'Linha Nacional contra Tráfico', nNHTHS:'Voz · 200+ idiomas',
    nBeFree:'Envie "HELP" para BeFree', nBeFreeS:'Apoio confidencial via SMS',
    nWilkins:'Linha Segura Wilkins', nWilkinsS:'Suporte em 10 idiomas',
    nPoison:'Centro de Intoxicações', nPoisonS:'Grátis · 24/7',
    nCrisis:'Linha de Crise e Suicídio', nCrisisS:'Voz · Texto · Chat',
    nApd:'Polícia de Atlanta (Não-Emergência)', nApdS:'Boletins · Achados',
    nMarta:'Atendimento MARTA', nMartaS:'Informações · Achados',
    install:'Adicione à tela inicial para acesso offline imediato.',
    footMain:'<strong>Tap FIFA</strong> por Wilkins Media × FTH Trading',
    footSub:'Feito para Atlanta · Copa do Mundo 2026 · Segurança sempre primeiro.',
    phraseH:'Frases de Emergência', phraseSub:'Mostre esta tela à equipe ou polícia.',
    routeMins:'min caminhando + transporte · {dist} km',
    spnT:'Passe Grátis MARTA Dia de Jogo', spnP:'Toque para escanear · Pule a fila em Five Points'
  },
  fr:{__name:'Français',__flag:'🇫🇷',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Bienvenue',
    heroSub:'Assistance multilingue en direct, sécurité et orientation pour la FIFA Atlanta.',
    sosT:'Urgence — Appuyez pour appeler le 911',
    sosS:'Toujours actif · GPS envoyé au personnel',
    iFood:'Cuisine locale', iFoodS:'Cuisine culturelle près de vous',
    iRoute:'Hôtel → Siège', iRouteS:'Itinéraire porte à porte',
    iRewards:'Mes récompenses', iRewardsS:'Badges et avantages',
    iPhrases:'Phrases de sécurité', iPhrasesS:'10 langues',
    spnCta:'Activer',
    mapT:'Itinéraire Hôtel → Siège', mapLive:'EN DIRECT',
    from:'De (hôtel)', to:'À (porte / siège)',
    routeBtn:'Obtenir l\'itinéraire',
    numbersH:'Sécurité & Aide · 24/7',
    n911:'Police · Pompiers · Médical', n911S:'Urgence vitale',
    nNHTH:'Ligne Nationale contre la Traite', nNHTHS:'Voix · 200+ langues',
    nBeFree:'Texto "HELP" à BeFree', nBeFreeS:'Soutien SMS confidentiel',
    nWilkins:'Ligne Sûre Wilkins', nWilkinsS:'Soutien en 10 langues',
    nPoison:'Centre Anti-Poison', nPoisonS:'Gratuit · 24/7',
    nCrisis:'Ligne de Crise et Suicide', nCrisisS:'Voix · Texte · Chat',
    nApd:'Police d\'Atlanta (Non-Urgence)', nApdS:'Rapports · Objets trouvés',
    nMarta:'Service Clientèle MARTA', nMartaS:'Transport · Objets perdus',
    install:'Ajoutez à l\'écran d\'accueil pour un accès hors ligne.',
    footMain:'<strong>Tap FIFA</strong> par Wilkins Media × FTH Trading',
    footSub:'Conçu pour Atlanta · Coupe du Monde 2026 · La sécurité prime.',
    phraseH:'Phrases d\'Urgence', phraseSub:'Montrez cet écran au personnel ou à la police.',
    routeMins:'min à pied + transport · {dist} km',
    spnT:'Pass MARTA Gratuit Jour de Match', spnP:'Toucher pour scanner · Passez devant à Five Points'
  },
  de:{__name:'Deutsch',__flag:'🇩🇪',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Willkommen',
    heroSub:'Mehrsprachige Live-Unterstützung, Sicherheit und Wegweisung zur FIFA Atlanta.',
    sosT:'Notfall — Tippen für 911',
    sosS:'Immer verfügbar · GPS an Personal',
    iFood:'Essen wie zu Hause', iFoodS:'Kulturelle Küche in der Nähe',
    iRoute:'Hotel → Sitz', iRouteS:'Tür-zu-Tür-Wegweisung',
    iRewards:'Meine Belohnungen', iRewardsS:'Abzeichen & Vorteile',
    iPhrases:'Sicherheitsphrasen', iPhrasesS:'10 Sprachen',
    spnCta:'Aktivieren',
    mapT:'Route Hotel → Sitz', mapLive:'LIVE',
    from:'Von (Hotel)', to:'Nach (Tor / Sitz)',
    routeBtn:'Wegbeschreibung',
    numbersH:'Sicherheit & Hilfe · 24/7',
    n911:'Polizei · Feuer · Medizin', n911S:'Lebensgefahr',
    nNHTH:'Nat. Hotline gegen Menschenhandel', nNHTHS:'Stimme · 200+ Sprachen',
    nBeFree:'SMS "HELP" an BeFree', nBeFreeS:'Vertrauliche SMS-Hilfe',
    nWilkins:'Wilkins Sicherheitslinie', nWilkinsS:'Unterstützung in 10 Sprachen',
    nPoison:'Giftnotruf', nPoisonS:'Kostenlos · 24/7',
    nCrisis:'Krisen- und Suizidhotline', nCrisisS:'Stimme · Text · Chat',
    nApd:'Atlanta Polizei (Nicht-Notfall)', nApdS:'Anzeigen · Fundbüro',
    nMarta:'MARTA Kundendienst', nMartaS:'Transit · Fundsachen',
    install:'Zum Startbildschirm hinzufügen für Offline-Zugriff.',
    footMain:'<strong>Tap FIFA</strong> von Wilkins Media × FTH Trading',
    footSub:'Gebaut für Atlanta · WM 2026 · Sicherheit hat Vorrang.',
    phraseH:'Notfallphrasen', phraseSub:'Zeigen Sie diesen Bildschirm Personal oder Polizei.',
    routeMins:'Min zu Fuß + Transit · {dist} km',
    spnT:'MARTA Kostenloser Spieltagspass', spnP:'Zum Scannen tippen · Schlange überspringen bei Five Points'
  },
  it:{__name:'Italiano',__flag:'🇮🇹',__dir:'ltr',
    topSub:'Atlanta 2026 · Wilkins Media',
    hello:'Benvenuto',
    heroSub:'Assistenza multilingue dal vivo, sicurezza e orientamento per la FIFA Atlanta.',
    sosT:'Emergenza — Tocca per chiamare 911',
    sosS:'Sempre attivo · GPS al personale',
    iFood:'Cibo di casa', iFoodS:'Cucina culturale vicino a te',
    iRoute:'Hotel → Posto', iRouteS:'Indicazioni porta a porta',
    iRewards:'Le mie ricompense', iRewardsS:'Distintivi e vantaggi',
    iPhrases:'Frasi di sicurezza', iPhrasesS:'10 lingue',
    spnCta:'Attiva',
    mapT:'Percorso Hotel → Posto', mapLive:'LIVE',
    from:'Da (hotel)', to:'A (cancello / posto)',
    routeBtn:'Ottieni indicazioni',
    numbersH:'Sicurezza e Aiuto · 24/7',
    n911:'Polizia · Vigili · Medico', n911S:'Emergenza vitale',
    nNHTH:'Hotline Nazionale Antitratta', nNHTHS:'Voce · 200+ lingue',
    nBeFree:'SMS "HELP" a BeFree', nBeFreeS:'Supporto SMS riservato',
    nWilkins:'Linea Sicura Wilkins', nWilkinsS:'Supporto in 10 lingue',
    nPoison:'Centro Antiveleni', nPoisonS:'Gratuito · 24/7',
    nCrisis:'Linea di Crisi e Suicidio', nCrisisS:'Voce · Testo · Chat',
    nApd:'Polizia Atlanta (Non-Emergenza)', nApdS:'Denunce · Oggetti smarriti',
    nMarta:'Servizio Clienti MARTA', nMartaS:'Trasporti · Oggetti smarriti',
    install:'Aggiungi alla schermata Home per accesso offline.',
    footMain:'<strong>Tap FIFA</strong> di Wilkins Media × FTH Trading',
    footSub:'Costruito per Atlanta · Mondiali 2026 · Sicurezza prima di tutto.',
    phraseH:'Frasi di Emergenza', phraseSub:'Mostra questa schermata a personale o polizia.',
    routeMins:'min a piedi + trasporto · {dist} km',
    spnT:'MARTA Pass Gratis Giorno Partita', spnP:'Tocca per scansionare · Salta la fila a Five Points'
  },
  ar:{__name:'العربية',__flag:'🇸🇦',__dir:'rtl',
    topSub:'أتلانتا 2026 · ويلكنز ميديا',
    hello:'أهلاً وسهلاً',
    heroSub:'دعم متعدد اللغات مباشر وسلامة وتوجيه لكأس العالم في أتلانتا.',
    sosT:'طوارئ — اضغط للاتصال بـ 911',
    sosS:'يعمل دائماً · يُرسل GPS للموظفين',
    iFood:'طعام من البلد', iFoodS:'مطبخ ثقافي قريب منك',
    iRoute:'فندق → مقعد', iRouteS:'إرشادات من الباب للباب',
    iRewards:'مكافآتي', iRewardsS:'الشارات والمزايا',
    iPhrases:'عبارات السلامة', iPhrasesS:'10 لغات',
    spnCta:'تفعيل',
    mapT:'مسار فندق → مقعد', mapLive:'مباشر',
    from:'من (الفندق)', to:'إلى (البوابة / المقعد)',
    routeBtn:'احصل على الاتجاهات',
    numbersH:'السلامة والمساعدة · 24/7',
    n911:'شرطة · إطفاء · طوارئ طبية', n911S:'طوارئ تهدد الحياة',
    nNHTH:'الخط الوطني لمكافحة الاتجار', nNHTHS:'صوت · 200+ لغة',
    nBeFree:'أرسل "HELP" إلى BeFree', nBeFreeS:'دعم SMS سري',
    nWilkins:'خط ويلكنز للسلامة', nWilkinsS:'دعم بـ 10 لغات',
    nPoison:'مركز السموم', nPoisonS:'مجاني · 24/7',
    nCrisis:'خط الأزمات والانتحار', nCrisisS:'صوت · نص · دردشة',
    nApd:'شرطة أتلانتا (غير طارئة)', nApdS:'تقارير · مفقودات',
    nMarta:'خدمة عملاء MARTA', nMartaS:'معلومات النقل · مفقودات',
    install:'أضِف للشاشة الرئيسية للوصول دون اتصال.',
    footMain:'<strong>تاب فيفا</strong> من ويلكنز ميديا × FTH Trading',
    footSub:'صُمم لأتلانتا · كأس العالم 2026 · السلامة أولاً دائماً.',
    phraseH:'عبارات الطوارئ', phraseSub:'اعرض هذه الشاشة على الموظفين أو الشرطة.',
    routeMins:'دقيقة مشي + نقل · {dist} كم',
    spnT:'تذكرة MARTA مجانية يوم المباراة', spnP:'اضغط للمسح · تخطَّ الطابور في Five Points'
  },
  zh:{__name:'中文',__flag:'🇨🇳',__dir:'ltr',
    topSub:'亚特兰大 2026 · Wilkins Media',
    hello:'欢迎',
    heroSub:'为亚特兰大世界杯提供实时多语言支持、安全和导览。',
    sosT:'紧急 — 点击拨打 911',
    sosS:'始终有效 · GPS 已发送给工作人员',
    iFood:'家乡美食', iFoodS:'附近的文化美食',
    iRoute:'酒店 → 座位', iRouteS:'门到门指引',
    iRewards:'我的奖励', iRewardsS:'徽章和福利',
    iPhrases:'安全用语', iPhrasesS:'10 种语言',
    spnCta:'激活',
    mapT:'酒店 → 座位 路线', mapLive:'实时',
    from:'起点（酒店）', to:'终点（入口 / 座位）',
    routeBtn:'获取路线',
    numbersH:'安全与帮助 · 24/7',
    n911:'警察 · 消防 · 医疗', n911S:'生命安全紧急',
    nNHTH:'国家反人口贩卖热线', nNHTHS:'语音 · 200+ 种语言',
    nBeFree:'发送 "HELP" 至 BeFree', nBeFreeS:'保密短信支持',
    nWilkins:'Wilkins 安全热线', nWilkinsS:'10 种语言支持',
    nPoison:'中毒控制中心', nPoisonS:'免费 · 24/7',
    nCrisis:'自杀和危机生命线', nCrisisS:'语音 · 短信 · 聊天',
    nApd:'亚特兰大警察（非紧急）', nApdS:'报案 · 失物招领',
    nMarta:'MARTA 客户服务', nMartaS:'交通信息 · 失物',
    install:'添加到主屏幕以获得即时离线访问。',
    footMain:'<strong>Tap FIFA</strong> 由 Wilkins Media × FTH Trading 提供',
    footSub:'为亚特兰大打造 · 2026 世界杯 · 安全永远优先。',
    phraseH:'紧急用语', phraseSub:'向工作人员或警察出示此屏幕。',
    routeMins:'分钟步行 + 交通 · {dist} 公里',
    spnT:'MARTA 比赛日免费通行证', spnP:'点击扫描 · 在 Five Points 跳过排队'
  },
  ja:{__name:'日本語',__flag:'🇯🇵',__dir:'ltr',
    topSub:'アトランタ 2026 · Wilkins Media',
    hello:'ようこそ',
    heroSub:'FIFAアトランタ向けライブ多言語サポート、安全、案内。',
    sosT:'緊急 — タップして911に電話',
    sosS:'常に動作 · GPSをスタッフに送信',
    iFood:'故郷の料理', iFoodS:'近くの文化料理',
    iRoute:'ホテル → 座席', iRouteS:'ドアtoドア案内',
    iRewards:'マイリワード', iRewardsS:'バッジと特典',
    iPhrases:'安全フレーズ', iPhrasesS:'10言語',
    spnCta:'有効化',
    mapT:'ホテル → 座席 経路', mapLive:'ライブ',
    from:'出発（ホテル）', to:'到着（ゲート / 座席）',
    routeBtn:'経路を取得',
    numbersH:'安全とヘルプ · 24/7',
    n911:'警察 · 消防 · 救急', n911S:'生命緊急',
    nNHTH:'人身取引全国ホットライン', nNHTHS:'音声 · 200+ 言語',
    nBeFree:'BeFreeに「HELP」を送信', nBeFreeS:'機密SMSサポート',
    nWilkins:'Wilkins セーフライン', nWilkinsS:'10言語サポート',
    nPoison:'毒物管理センター', nPoisonS:'無料 · 24/7',
    nCrisis:'自殺・危機ライフライン', nCrisisS:'音声 · テキスト · チャット',
    nApd:'アトランタ警察（非緊急）', nApdS:'通報 · 遺失物',
    nMarta:'MARTAカスタマーサービス', nMartaS:'交通情報 · 遺失物',
    install:'ホーム画面に追加してオフラインアクセス。',
    footMain:'<strong>Tap FIFA</strong> by Wilkins Media × FTH Trading',
    footSub:'アトランタのために · 2026年ワールドカップ · 安全が常に優先。',
    phraseH:'緊急フレーズ', phraseSub:'スタッフや警察にこの画面を見せてください。',
    routeMins:'分 徒歩+交通 · {dist} km',
    spnT:'MARTA 試合日無料パス', spnP:'タップしてスキャン · Five Pointsで列をスキップ'
  },
  ko:{__name:'한국어',__flag:'🇰🇷',__dir:'ltr',
    topSub:'애틀랜타 2026 · Wilkins Media',
    hello:'환영합니다',
    heroSub:'FIFA 애틀랜타 라이브 다국어 지원, 안전 및 안내.',
    sosT:'응급 — 탭하여 911 전화',
    sosS:'항상 작동 · GPS가 직원에게 전송됨',
    iFood:'고향 음식', iFoodS:'주변 문화 요리',
    iRoute:'호텔 → 좌석', iRouteS:'도어 투 도어 안내',
    iRewards:'내 보상', iRewardsS:'배지 및 혜택',
    iPhrases:'안전 문구', iPhrasesS:'10개 언어',
    spnCta:'활성화',
    mapT:'호텔 → 좌석 경로', mapLive:'라이브',
    from:'출발 (호텔)', to:'도착 (게이트 / 좌석)',
    routeBtn:'길찾기',
    numbersH:'안전 및 도움 · 24/7',
    n911:'경찰 · 소방 · 구급', n911S:'생명 응급',
    nNHTH:'국가 인신매매 핫라인', nNHTHS:'음성 · 200+ 언어',
    nBeFree:'BeFree에 "HELP" 문자', nBeFreeS:'기밀 SMS 지원',
    nWilkins:'Wilkins 안전 라인', nWilkinsS:'10개 언어 지원',
    nPoison:'중독 통제 센터', nPoisonS:'무료 · 24/7',
    nCrisis:'자살·위기 라이프라인', nCrisisS:'음성 · 문자 · 채팅',
    nApd:'애틀랜타 경찰 (비응급)', nApdS:'신고 · 분실물',
    nMarta:'MARTA 고객 서비스', nMartaS:'교통 정보 · 분실물',
    install:'홈 화면에 추가하여 오프라인 접근.',
    footMain:'<strong>Tap FIFA</strong> by Wilkins Media × FTH Trading',
    footSub:'애틀랜타를 위해 · 2026 월드컵 · 안전이 항상 우선.',
    phraseH:'응급 문구', phraseSub:'직원이나 경찰에게 이 화면을 보여주세요.',
    routeMins:'분 도보 + 교통 · {dist} km',
    spnT:'MARTA 경기일 무료 패스', spnP:'탭하여 스캔 · Five Points 줄 건너뛰기'
  }
};

// Multi-language emergency phrase set (always shown together)
const PHRASES = [
  { key:'help',  emoji:'🚨', en:'I need help. Please call the police.', es:'Necesito ayuda. Por favor llamen a la policía.', pt:'Preciso de ajuda. Por favor chamem a polícia.', fr:'J\'ai besoin d\'aide. Appelez la police.', de:'Ich brauche Hilfe. Bitte rufen Sie die Polizei.', it:'Ho bisogno di aiuto. Chiamate la polizia.', ar:'أحتاج إلى مساعدة. اتصلوا بالشرطة من فضلكم.', zh:'我需要帮助。请叫警察。', ja:'助けが必要です。警察を呼んでください。', ko:'도움이 필요합니다. 경찰을 불러주세요.' },
  { key:'lost',  emoji:'🧭', en:'I am lost. Please help me find my hotel.', es:'Estoy perdido. Ayúdenme a encontrar mi hotel.', pt:'Estou perdido. Por favor me ajudem a achar meu hotel.', fr:'Je suis perdu. Aidez-moi à retrouver mon hôtel.', de:'Ich habe mich verlaufen. Helfen Sie mir bitte, mein Hotel zu finden.', it:'Mi sono perso. Aiutatemi a trovare il mio hotel.', ar:'لقد ضللت الطريق. ساعدوني في العثور على فندقي.', zh:'我迷路了。请帮我找到我的酒店。', ja:'道に迷いました。ホテルを見つけるのを手伝ってください。', ko:'길을 잃었습니다. 호텔을 찾도록 도와주세요.' },
  { key:'medic', emoji:'🩺', en:'I need a doctor. It is urgent.', es:'Necesito un médico. Es urgente.', pt:'Preciso de um médico. É urgente.', fr:'J\'ai besoin d\'un médecin. C\'est urgent.', de:'Ich brauche einen Arzt. Es ist dringend.', it:'Ho bisogno di un medico. È urgente.', ar:'أحتاج إلى طبيب. الأمر عاجل.', zh:'我需要医生。很紧急。', ja:'医者が必要です。急いでいます。', ko:'의사가 필요합니다. 긴급합니다.' },
  { key:'unsafe',emoji:'🛡️', en:'I do not feel safe. Someone is following me.', es:'No me siento seguro. Alguien me está siguiendo.', pt:'Não me sinto seguro. Alguém está me seguindo.', fr:'Je ne me sens pas en sécurité. Quelqu\'un me suit.', de:'Ich fühle mich nicht sicher. Jemand folgt mir.', it:'Non mi sento al sicuro. Qualcuno mi segue.', ar:'لا أشعر بالأمان. شخص ما يتبعني.', zh:'我感觉不安全。有人在跟踪我。', ja:'安全ではないと感じます。誰かに尾行されています。', ko:'안전하지 않다고 느낍니다. 누군가 저를 따라오고 있습니다.' },
  { key:'child', emoji:'👶', en:'I have lost a child. Please help.', es:'Perdí a un niño. Por favor ayuden.', pt:'Perdi uma criança. Por favor ajudem.', fr:'J\'ai perdu un enfant. Aidez-moi.', de:'Ich habe ein Kind verloren. Bitte helfen.', it:'Ho perso un bambino. Per favore aiutate.', ar:'فقدت طفلاً. أرجو المساعدة.', zh:'我丢失了一个孩子。请帮助。', ja:'子供を見失いました。助けてください。', ko:'아이를 잃어버렸습니다. 도와주세요.' },
  { key:'traffic',emoji:'🆘', en:'I think someone is being trafficked. Please call 1-888-373-7888.', es:'Creo que alguien está siendo víctima de trata. Llamen al 1-888-373-7888.', pt:'Acho que alguém está sendo traficado. Liguem 1-888-373-7888.', fr:'Je pense que quelqu\'un est victime de traite. Appelez le 1-888-373-7888.', de:'Ich glaube, jemand wird verschleppt. Rufen Sie 1-888-373-7888 an.', it:'Penso che qualcuno sia vittima di tratta. Chiamate 1-888-373-7888.', ar:'أعتقد أن شخصاً يتعرض للاتجار. اتصلوا 1-888-373-7888.', zh:'我认为有人正在被贩卖。请拨打 1-888-373-7888。', ja:'人身取引の被害者がいるかもしれません。1-888-373-7888に電話してください。', ko:'누군가 인신매매 피해자인 것 같습니다. 1-888-373-7888로 전화해주세요.' },
  { key:'water', emoji:'💧', en:'I need water. I feel faint.', es:'Necesito agua. Me siento mareado.', pt:'Preciso de água. Estou tonto.', fr:'J\'ai besoin d\'eau. Je me sens faible.', de:'Ich brauche Wasser. Mir ist schwach.', it:'Ho bisogno di acqua. Mi sento debole.', ar:'أحتاج إلى ماء. أشعر بالإغماء.', zh:'我需要水。我感觉头晕。', ja:'水が必要です。気分が悪いです。', ko:'물이 필요합니다. 어지럽습니다.' },
  { key:'allergy',emoji:'⚠️', en:'I have a serious allergy. Please call 911.', es:'Tengo una alergia grave. Llamen al 911.', pt:'Tenho uma alergia grave. Liguem 911.', fr:'J\'ai une allergie grave. Appelez le 911.', de:'Ich habe eine schwere Allergie. Rufen Sie 911 an.', it:'Ho una grave allergia. Chiamate 911.', ar:'لدي حساسية خطيرة. اتصلوا 911.', zh:'我有严重的过敏。请拨打 911。', ja:'重度のアレルギーがあります。911に電話してください。', ko:'심각한 알레르기가 있습니다. 911에 전화해주세요.' }
];

// Sponsor / POS campaigns (rotating). Pluggable — replace via window.WILKINS_CAMPAIGNS.
const CAMPAIGNS = [
  { id:'marta', icon:'🏟️', t:{en:'MARTA Free Match-Day Pass', es:'Pase MARTA Gratis Día de Partido', pt:'Passe MARTA Grátis', fr:'Pass MARTA Gratuit', de:'MARTA Gratispass', it:'Pass MARTA Gratis', ar:'تذكرة MARTA مجانية', zh:'MARTA 免费通行证', ja:'MARTA 無料パス', ko:'MARTA 무료 패스'}, p:{en:'Tap to scan · Skip the line at Five Points', es:'Toque para escanear · Salte la fila', pt:'Toque para escanear · Pule a fila', fr:'Toucher pour scanner · Passez devant', de:'Zum Scannen tippen · Schlange überspringen', it:'Tocca per scansionare · Salta la fila', ar:'اضغط للمسح · تخطَّ الطابور', zh:'点击扫描 · 跳过排队', ja:'タップしてスキャン · 列をスキップ', ko:'탭하여 스캔 · 줄 건너뛰기'}, color:'linear-gradient(135deg,#22c55e 0%,#0891b2 100%)' },
  { id:'paella',icon:'🥘', t:{en:'La Nacional · Authentic Paella', es:'La Nacional · Paella Auténtica', pt:'La Nacional · Paella', fr:'La Nacional · Paella', de:'La Nacional · Paella', it:'La Nacional · Paella', ar:'لا ناسيونال · باييا أصيلة', zh:'La Nacional · 正宗西班牙海鲜饭', ja:'La Nacional · 本場のパエリア', ko:'La Nacional · 정통 파에야'}, p:{en:'0.8 mi · 15% off with code FIFA26', es:'1.3 km · 15% con código FIFA26', pt:'1.3 km · 15% com FIFA26', fr:'1.3 km · 15% avec FIFA26', de:'1,3 km · 15% mit FIFA26', it:'1,3 km · 15% con FIFA26', ar:'1.3 كم · خصم 15٪ FIFA26', zh:'1.3 公里 · FIFA26 优惠 15%', ja:'1.3km · FIFA26で15%オフ', ko:'1.3km · FIFA26로 15% 할인'}, color:'linear-gradient(135deg,#f59e0b 0%,#dc2626 100%)' },
  { id:'kbbq',  icon:'🍖', t:{en:'Buford Hwy K-BBQ', es:'K-BBQ Buford Hwy', pt:'K-BBQ Buford Hwy', fr:'K-BBQ Buford Hwy', de:'K-BBQ Buford Hwy', it:'K-BBQ Buford Hwy', ar:'باربكيو كوري Buford', zh:'Buford 韩式烤肉', ja:'Buford 韓国焼肉', ko:'뷰포드 한식 BBQ'}, p:{en:'Free shuttle · 1 stop from stadium', es:'Shuttle gratis · 1 parada', pt:'Shuttle grátis · 1 parada', fr:'Navette gratuite · 1 arrêt', de:'Gratis-Shuttle · 1 Halt', it:'Navetta gratis · 1 fermata', ar:'حافلة مجانية · توقف واحد', zh:'免费班车 · 距离1站', ja:'無料シャトル · 1駅', ko:'무료 셔틀 · 1정거장'}, color:'linear-gradient(135deg,#7c3aed 0%,#c026d3 100%)' }
];

// =========================================================
// 3. APP STATE & UI
// =========================================================
let lang = (navigator.language || 'en').slice(0,2);
if (!I18N[lang]) lang = 'en';
let map, routeLayer, hotelMarker, gateMarker;

function applyLang(){
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = t.__dir;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n;
    if (t[k] != null) el.innerHTML = t[k];
  });
  const flagEl = document.getElementById('flag');
  if (flagEl) flagEl.textContent = t.__flag;
  // sponsor card text in current lang
  const camp = window.__activeCampaign || CAMPAIGNS[0];
  document.getElementById('spnT').textContent = camp.t[lang] || camp.t.en;
  document.getElementById('spnP').textContent = camp.p[lang] || camp.p.en;
  document.getElementById('sponsorCard').style.background = camp.color;
  document.querySelector('#sponsorCard .badge').textContent = camp.icon;
  // re-render route info if cached
  if (window.__lastRoute) renderRouteInfo(window.__lastRoute);
  populateSelects();
}

function populateSelects(){
  const hSel = document.getElementById('hotelSel');
  const gSel = document.getElementById('gateSel');
  hSel.innerHTML = HOTELS.map(h=>`<option value="${h.id}">${h.name}</option>`).join('');
  gSel.innerHTML = GATES.map(g=>`<option value="${g.id}">${g.name} · ${g.seat}</option>`).join('');
}

function buildPhraseList(){
  const wrap = document.getElementById('phraseList');
  wrap.innerHTML = PHRASES.map(p=>{
    const text = p[lang] || p.en;
    return `<div class="row">
      <div class="flag">${p.emoji}</div>
      <div class="lang" style="flex:1">
        <div class="phrase">${text}</div>
        <div class="ph-sub">EN: ${p.en}</div>
      </div>
      <button class="speak" onclick="speakPhrase('${p.key}','${lang}')">🔊</button>
    </div>`;
  }).join('');
}
// Broadcaster-quality voice via Deepgram Aura (Cloudflare Worker proxy).
// Falls back to native Web Speech if the worker is unreachable.
const VOICE_API = (window.WILKINS_VOICE_API || 'https://tap-fifa-voice.kevanbtc.workers.dev') + '/tts';
let __voiceAudio = null;
function speakPhrase(key, l){
  const p = PHRASES.find(x=>x.key===key);
  const text = p[l] || p.en;
  speak(text, l);
}
function speak(text, l){
  if (!text) return;
  // Stop any prior playback (Deepgram or Web Speech)
  try { if (__voiceAudio) { __voiceAudio.pause(); __voiceAudio = null; } } catch(e){}
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch(e){}

  const url = `${VOICE_API}?lang=${encodeURIComponent(l||'en')}&text=${encodeURIComponent(text)}`;
  const audio = new Audio(url);
  audio.crossOrigin = 'anonymous';
  audio.preload = 'auto';
  __voiceAudio = audio;
  // If Deepgram fails, fall back to Web Speech
  audio.addEventListener('error', () => fallbackSpeak(text, l));
  audio.play().catch(() => fallbackSpeak(text, l));
}
function fallbackSpeak(text, l){
  if (!('speechSynthesis' in window)) { alert(text); return; }
  const u = new SpeechSynthesisUtterance(text);
  const map = {en:'en-US',es:'es-ES',pt:'pt-BR',fr:'fr-FR',de:'de-DE',it:'it-IT',ar:'ar-SA',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR'};
  u.lang = map[l] || 'en-US';
  u.rate = 0.95; u.pitch = 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
window.speak = speak;
function openModal(){ document.getElementById('phraseModal').classList.add('show'); buildPhraseList(); }
function closeModal(){ document.getElementById('phraseModal').classList.remove('show'); }
window.closeModal = closeModal; window.speakPhrase = speakPhrase;

// =========================================================
// 4. MAP — Leaflet on OSM tiles
// =========================================================
function initMap(){
  map = L.map('map', { zoomControl:true, attributionControl:true })
    .setView([STADIUM.lat, STADIUM.lng], 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom:19, attribution:'© OpenStreetMap, © CARTO'
  }).addTo(map);

  // Stadium marker
  L.marker([STADIUM.lat, STADIUM.lng], { icon: divIcon('🏟️','#ef4444') })
    .addTo(map).bindPopup('<b>Mercedes-Benz Stadium</b>');

  // Gates
  GATES.forEach(g=>{
    L.marker([g.lat,g.lng], { icon: divIcon('🚪','#7c3aed') })
      .addTo(map).bindPopup(`<b>${g.name}</b><br>${g.seat}`);
  });
  // MARTA
  MARTA_HUBS.forEach(h=>{
    L.marker([h.lat,h.lng], { icon: divIcon('🚇','#3b82f6') })
      .addTo(map).bindPopup(`<b>${h.name}</b>`);
  });
  // Safe pins
  SAFE_PINS.forEach(s=>{
    L.marker([s.lat,s.lng], { icon: divIcon('🛡️','#22c55e') })
      .addTo(map).bindPopup(`<b>${s.name}</b>`);
  });
  // Tap Safety Beacons — branded SVG pin markers (gradient teardrop, no emoji)
  UNICORN_PINS.forEach(u=>{
    L.marker([u.lat,u.lng], { icon: brandedPin(), title: u.name, alt: u.name, keyboard:true })
      .addTo(map).bindPopup(`<b>${u.name}</b><br><span style="color:#9ca3af;font-size:.78rem">Marked safe-zone beacon · Wilkins Safe Line</span>`);
  });
}
function divIcon(emoji, color){
  return L.divIcon({
    html:`<div style="background:${color};color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:.95rem;box-shadow:0 4px 12px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.4)">${emoji}</div>`,
    className:'', iconSize:[30,30], iconAnchor:[15,15]
  });
}
// Branded gradient pin for safety beacons. Inline SVG with unique gradient id per call
// (Leaflet panes can dedup ids; using inline gradient avoids <use href> resolution issues).
let __pinSeq = 0;
function brandedPin(){
  const gid = 'tapPinG_' + (++__pinSeq);
  return L.divIcon({
    className:'',
    iconSize:[36,40],
    iconAnchor:[18,38],
    popupAnchor:[0,-32],
    html:`<div style="width:36px;height:40px;display:grid;place-items:center;filter:drop-shadow(0 4px 8px rgba(0,0,0,.55))">
      <svg viewBox="0 0 24 26" width="36" height="40" aria-hidden="true">
        <defs><linearGradient id="${gid}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f472b6"/><stop offset=".55" stop-color="#a855f7"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
        <path fill="url(#${gid})" stroke="rgba(255,255,255,.85)" stroke-width="1" d="M12 1a8 8 0 00-8 8c0 6 8 16 8 16s8-10 8-16a8 8 0 00-8-8z"/>
        <circle cx="12" cy="9" r="3" fill="#0a0203"/>
        <circle cx="12" cy="9" r="1.4" fill="#22d3ee"/>
      </svg>
    </div>`
  });
}

// OSRM public routing for hotel→gate (walking)
async function routeHotelToGate(){
  const hotelId = document.getElementById('hotelSel').value;
  const gateId  = document.getElementById('gateSel').value;
  const h = HOTELS.find(x=>x.id===hotelId);
  const g = GATES.find(x=>x.id===gateId);
  if (!h || !g) return;
  if (hotelMarker) map.removeLayer(hotelMarker);
  if (gateMarker)  map.removeLayer(gateMarker);
  if (routeLayer)  map.removeLayer(routeLayer);
  hotelMarker = L.marker([h.lat,h.lng], { icon: divIcon('🏨','#f59e0b') }).addTo(map).bindPopup(`<b>${h.name}</b>`).openPopup();
  gateMarker  = L.marker([g.lat,g.lng], { icon: divIcon('🎟️','#ef4444') }).addTo(map);

  const url = `https://router.project-osrm.org/route/v1/foot/${h.lng},${h.lat};${g.lng},${g.lat}?overview=full&geometries=geojson&steps=false`;
  let info = { distance: haversine(h,g), duration: haversine(h,g)/0.0014 };
  try {
    const r = await fetch(url);
    const j = await r.json();
    if (j && j.routes && j.routes[0]) {
      const route = j.routes[0];
      info = { distance: route.distance/1000, duration: route.duration/60 };
      routeLayer = L.geoJSON(route.geometry, { style: { color:'#ef4444', weight:5, opacity:.85 } }).addTo(map);
    }
  } catch(e){
    // fallback: straight line
    routeLayer = L.polyline([[h.lat,h.lng],[g.lat,g.lng]], { color:'#ef4444', weight:5, dashArray:'6,8' }).addTo(map);
  }
  const bounds = L.latLngBounds([[h.lat,h.lng],[g.lat,g.lng]]).pad(0.2);
  map.fitBounds(bounds);
  window.__lastRoute = { hotel:h, gate:g, info };
  renderRouteInfo(window.__lastRoute);
}
function renderRouteInfo(r){
  const t = I18N[lang];
  const el = document.getElementById('routeInfo');
  const mins = Math.round(r.info.duration);
  const km = r.info.distance.toFixed(2);
  el.innerHTML = `<b>${r.hotel.name} → ${r.gate.name}</b><br>${t.routeMins.replace('{dist}', km).replace(/^\d+/,'')} ≈ <b>${mins} min</b><br><span style="color:var(--ink-3)">${r.gate.seat}</span>`;
  el.classList.add('show');
}
function haversine(a,b){
  const toR = d=>d*Math.PI/180;
  const R = 6371;
  const dLat = toR(b.lat-a.lat), dLng = toR(b.lng-a.lng);
  const x = Math.sin(dLat/2)**2 + Math.cos(toR(a.lat))*Math.cos(toR(b.lat))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

// =========================================================
// 5. WIRE-UP
// =========================================================
document.addEventListener('DOMContentLoaded', ()=>{
  // Pick campaign (override via global if defined)
  const list = (window.WILKINS_CAMPAIGNS && window.WILKINS_CAMPAIGNS.length) ? window.WILKINS_CAMPAIGNS : CAMPAIGNS;
  window.__activeCampaign = list[Math.floor(Math.random()*list.length)];

  document.getElementById('lang').value = lang;
  document.getElementById('lang').addEventListener('change', e=>{
    lang = e.target.value;
    try { localStorage.setItem('tapfifa.lang', lang); } catch(_){}
    applyLang();
    // Broadcaster greeting on language switch
    const g = I18N[lang];
    speak(`${g.hello}. ${g.heroSub || ''}`.trim(), lang);
  });
  // restore preference
  try { const saved = localStorage.getItem('tapfifa.lang'); if (saved && I18N[saved]) { lang = saved; document.getElementById('lang').value = saved; } } catch(_){}

  populateSelects();
  applyLang();
  initMap();

  document.querySelectorAll('.intent').forEach(b=>{
    b.addEventListener('click', ()=>{
      const a = b.dataset.action;
      if (a === 'phrases') openModal();
      else if (a === 'route') document.getElementById('map').scrollIntoView({behavior:'smooth',block:'center'});
      else if (a === 'food') document.getElementById('sponsorCard').scrollIntoView({behavior:'smooth',block:'center'});
      else if (a === 'rewards') alert('🎁  ' + ({en:'Connect your ticket to unlock rewards.',es:'Conecte su boleto para desbloquear recompensas.',pt:'Conecte seu ingresso para desbloquear recompensas.',fr:'Connectez votre billet pour débloquer les récompenses.',de:'Verbinden Sie Ihr Ticket für Belohnungen.',it:'Connetti il biglietto per sbloccare ricompense.',ar:'اربط تذكرتك لفتح المكافآت.',zh:'连接您的门票以解锁奖励。',ja:'チケットを連携して特典を解除。',ko:'티켓을 연결하여 보상을 잠금 해제하세요.'}[lang]));
    });
  });

  document.getElementById('routeBtn').addEventListener('click', routeHotelToGate);

  // Sponsor click → tracking hook (POS wiring point)
  document.getElementById('sponsorCard').addEventListener('click', e=>{
    const ev = { event:'sponsor_tap', campaign:(window.__activeCampaign||{}).id, lang, ts:Date.now() };
    try { (window.WILKINS_TRACK||(()=>{}))(ev); } catch(_){}
    console.log('[wilkins] sponsor_tap', ev);
  });

  // Modal close on backdrop
  document.getElementById('phraseModal').addEventListener('click', e=>{
    if (e.target.id === 'phraseModal') closeModal();
  });

  // ── Unicorn Safety Guide ──
  wireUnicorn();
});

// =========================================================
// 6. TAP SAFETY COMPANION — branded family-safety wayfinding
//    (formerly "Unicorn Safety Guide" — keeps mascot, professional copy)
// =========================================================
//
// Copy guidelines:
// - Calm, concise, no overpromises ("trained safety partner is on the way")
// - Direct people to uniformed staff + emergency button + verified ride checklist
// - All ride providers shown are PLACEHOLDERS until ops/security verifies
//
const UNICORN_I18N = {
  en:{
    ucT:'Tap Safety Companion', ucSub:'Lost or unsure? Follow the unicorn to a marked safe zone.',
    ucListen:'Listen', ucRide:'Verified Ride', ucZone:'Safe Zone', ucGuide:'Walk With Me',
    ucStrip:'Family Safety Guide · Multilingual · Connects to Wilkins Safe Line',
    rideH:'Verified Ride Checklist',
    rideSub:'Before entering any vehicle, confirm every step. Stay with your group. Your safety overrides convenience.',
    rideOptionsH:'Safe Ride Options',
    rideDisclaimer:'Ride providers, shuttle details, and codes shown here are placeholders. Final partners and verification codes must be approved by Wilkins Media event operations and venue security before public launch.',
    rideWarn:'<strong>Stay safe:</strong> Confirm the driver’s name, license plate, pickup zone, and route before entering. Never accept a ride from someone who approaches you first. Share your trip with a trusted contact.',
    rideShare:'Share Trip', rideBack:'Return to Map', rideSos:'Emergency · Call 911',
    ride1:'Match the driver’s name to the one in your app.',
    ride2:'Match the license plate to the one in your app.',
    ride3:'Stand inside the marked pickup zone — never accept a ride at the curb from a stranger.',
    ride4:'Confirm the route on your phone before the trip starts.',
    ride5:'Share your live trip with a trusted contact or the Wilkins Safe Line.',
    ride6:'If anything feels wrong, exit at a public, staffed area and tap the emergency button.',
    ucSpeak:'You are safe. Walk to a marked safe zone or ask any uniformed staff member for help. Stay in well-lit, busy areas. If this is an emergency, tap the red 911 button.',
    zoneSpeak:'A safe zone is shown on your map. Walk along marked routes. Look for staff in marked uniforms. Stay with your group.',
    guideSpeak:'I will speak directions out loud. Walk at your normal pace. Stay on marked paths and stay near other people. If anything feels wrong, tap the red 911 button.'
  },
  es:{ucT:'Compañero de Seguridad Tap',ucSub:'¿Perdido o inseguro? Sigue al unicornio hasta una zona segura señalizada.',ucListen:'Escuchar',ucRide:'Viaje Verificado',ucZone:'Zona Segura',ucGuide:'Camina Conmigo',ucStrip:'Guía de Seguridad Familiar · Multilingüe · Conecta con Wilkins Safe Line',rideH:'Lista de Verificación de Viaje',rideSub:'Antes de subir a cualquier vehículo, confirma cada paso. Permanece con tu grupo.',rideOptionsH:'Opciones de Viaje Seguro',rideDisclaimer:'Los proveedores y códigos mostrados son ejemplos. Los socios finales deben ser aprobados por operaciones de Wilkins Media y seguridad del recinto antes del lanzamiento público.',rideWarn:'<strong>Mantente seguro:</strong> Confirma nombre del conductor, placa, zona de recogida y ruta antes de subir. Nunca aceptes un viaje de alguien que se te acerca primero. Comparte tu viaje con un contacto de confianza.',rideShare:'Compartir viaje',rideBack:'Volver al mapa',rideSos:'Emergencia · 911',ride1:'Verifica que el nombre del conductor coincida con el de tu app.',ride2:'Verifica que la placa coincida con la de tu app.',ride3:'Espera dentro de la zona de recogida señalada — nunca aceptes un viaje en la acera de un desconocido.',ride4:'Confirma la ruta en tu teléfono antes de iniciar el viaje.',ride5:'Comparte tu viaje en vivo con un contacto de confianza o con Wilkins Safe Line.',ride6:'Si algo se siente mal, sal en un lugar público con personal y toca el botón de emergencia.',ucSpeak:'Estás a salvo. Camina hacia una zona segura señalizada o pide ayuda a cualquier miembro del personal uniformado. Permanece en áreas iluminadas y concurridas. Si es una emergencia, toca el botón rojo de 911.',zoneSpeak:'Se muestra una zona segura en tu mapa. Camina por rutas señalizadas. Busca al personal uniformado. Permanece con tu grupo.',guideSpeak:'Diré las indicaciones en voz alta. Camina a tu ritmo normal. Permanece en caminos señalizados y cerca de otras personas. Si algo no está bien, toca el botón rojo de 911.'},
  pt:{ucT:'Companheiro de Segurança Tap',ucSub:'Perdido ou inseguro? Siga o unicórnio até uma zona segura sinalizada.',ucListen:'Ouvir',ucRide:'Corrida Verificada',ucZone:'Zona Segura',ucGuide:'Caminhe Comigo',ucStrip:'Guia de Segurança Familiar · Multilíngue · Conecta com Wilkins Safe Line',rideH:'Checklist de Corrida Verificada',rideSub:'Antes de entrar em qualquer veículo, confirme cada passo. Fique com seu grupo.',rideOptionsH:'Opções de Corrida Segura',rideDisclaimer:'Provedores e códigos mostrados aqui são placeholders. Os parceiros finais precisam ser aprovados pelas operações da Wilkins Media e pela segurança do local antes do lançamento público.',rideWarn:'<strong>Fique seguro:</strong> Confirme nome do motorista, placa, zona de embarque e rota antes de entrar. Nunca aceite carona de quem se aproxima primeiro. Compartilhe sua viagem com alguém de confiança.',rideShare:'Compartilhar viagem',rideBack:'Voltar ao mapa',rideSos:'Emergência · 911',ride1:'Confirme se o nome do motorista corresponde ao do app.',ride2:'Confirme se a placa corresponde à do app.',ride3:'Aguarde dentro da zona de embarque sinalizada.',ride4:'Confirme a rota no seu telefone antes da viagem começar.',ride5:'Compartilhe sua viagem ao vivo com um contato de confiança.',ride6:'Se algo parecer errado, saia em um local público com equipe e use o botão de emergência.',ucSpeak:'Você está seguro. Caminhe até uma zona segura sinalizada ou peça ajuda a qualquer funcionário uniformizado. Permaneça em áreas iluminadas e movimentadas. Se for emergência, toque o botão vermelho 911.',zoneSpeak:'Uma zona segura está marcada no seu mapa. Caminhe por rotas sinalizadas. Procure funcionários uniformizados.',guideSpeak:'Vou falar as direções em voz alta. Caminhe no seu ritmo normal. Fique em caminhos sinalizados e próximo de outras pessoas. Se algo estiver errado, toque o botão vermelho 911.'},
  fr:{ucT:'Compagnon Sécurité Tap',ucSub:'Perdu ou hésitant ? Suis la licorne jusqu’à une zone sûre signalée.',ucListen:'Écouter',ucRide:'Trajet Vérifié',ucZone:'Zone Sûre',ucGuide:'Marche Avec Moi',ucStrip:'Guide Sécurité Famille · Multilingue · Relié à la Wilkins Safe Line',rideH:'Checklist Trajet Vérifié',rideSub:'Avant de monter dans un véhicule, confirme chaque étape. Reste avec ton groupe.',rideOptionsH:'Options de Trajet Sûr',rideDisclaimer:'Les fournisseurs et codes affichés sont des exemples. Les partenaires finaux doivent être approuvés par les opérations Wilkins Media et la sécurité du site avant le lancement public.',rideWarn:'<strong>Reste prudent :</strong> Confirme le nom du chauffeur, la plaque, la zone d’embarquement et l’itinéraire avant de monter. N’accepte jamais une course d’un inconnu qui t’aborde. Partage ton trajet avec un contact de confiance.',rideShare:'Partager le trajet',rideBack:'Retour à la carte',rideSos:'Urgence · 911',ride1:'Vérifie que le nom du chauffeur correspond à celui de l’app.',ride2:'Vérifie que la plaque correspond à celle de l’app.',ride3:'Attends dans la zone d’embarquement signalée.',ride4:'Confirme l’itinéraire avant le départ.',ride5:'Partage ton trajet en direct avec un contact de confiance.',ride6:'Si quelque chose te dérange, descends dans un endroit public avec du personnel et touche le bouton d’urgence.',ucSpeak:'Tu es en sécurité. Marche vers une zone sûre signalée ou demande de l’aide à un membre du personnel en uniforme. Reste dans des zones éclairées et fréquentées. En cas d’urgence, touche le bouton rouge 911.',zoneSpeak:'Une zone sûre est indiquée sur ta carte. Marche le long des itinéraires signalés. Cherche le personnel en uniforme.',guideSpeak:'Je vais énoncer les directions à voix haute. Marche à ton rythme normal. Reste sur les chemins signalés. Si quelque chose te dérange, touche le bouton rouge 911.'},
  de:{ucT:'Tap-Sicherheitsbegleiter',ucSub:'Verloren oder unsicher? Folge dem Einhorn zu einer markierten sicheren Zone.',ucListen:'Hören',ucRide:'Verifizierte Fahrt',ucZone:'Sichere Zone',ucGuide:'Geh Mit Mir',ucStrip:'Familien-Sicherheitsleitfaden · Mehrsprachig · Mit Wilkins Safe Line verbunden',rideH:'Checkliste Verifizierte Fahrt',rideSub:'Bevor du in ein Fahrzeug einsteigst, bestätige jeden Schritt. Bleib bei deiner Gruppe.',rideOptionsH:'Sichere Fahrtoptionen',rideDisclaimer:'Hier gezeigte Anbieter und Codes sind Platzhalter. Endgültige Partner müssen vor dem öffentlichen Start von Wilkins Media Operations und der Veranstaltungssicherheit freigegeben werden.',rideWarn:'<strong>Bleib sicher:</strong> Bestätige Fahrername, Kennzeichen, Abholzone und Route vor dem Einsteigen. Steig nie zu jemandem ein, der dich anspricht. Teile deine Fahrt mit einem Vertrauten.',rideShare:'Fahrt teilen',rideBack:'Zurück zur Karte',rideSos:'Notruf · 911',ride1:'Prüfe, ob der Name des Fahrers mit der App übereinstimmt.',ride2:'Prüfe, ob das Kennzeichen mit der App übereinstimmt.',ride3:'Warte in der markierten Abholzone.',ride4:'Bestätige die Route vor Fahrtbeginn.',ride5:'Teile deine Live-Fahrt mit einem Vertrauten.',ride6:'Wenn etwas nicht stimmt, steig an einem öffentlichen Ort mit Personal aus und nutze den Notfallknopf.',ucSpeak:'Du bist sicher. Gehe zu einer markierten sicheren Zone oder bitte uniformiertes Personal um Hilfe. Bleib in beleuchteten, belebten Bereichen. Im Notfall drücke den roten 911-Knopf.',zoneSpeak:'Eine sichere Zone wird auf deiner Karte angezeigt. Gehe entlang markierter Routen. Halte nach uniformiertem Personal Ausschau.',guideSpeak:'Ich sage dir die Richtungen laut. Gehe in deinem normalen Tempo. Bleib auf markierten Wegen und in der Nähe anderer Menschen. Wenn etwas nicht stimmt, drücke den roten 911-Knopf.'},
  it:{ucT:'Compagno di Sicurezza Tap',ucSub:'Perso o insicuro? Segui l’unicorno fino a una zona sicura segnalata.',ucListen:'Ascolta',ucRide:'Corsa Verificata',ucZone:'Zona Sicura',ucGuide:'Cammina Con Me',ucStrip:'Guida Sicurezza Famiglia · Multilingue · Collegata alla Wilkins Safe Line',rideH:'Checklist Corsa Verificata',rideSub:'Prima di salire su un veicolo, conferma ogni passaggio. Resta con il tuo gruppo.',rideOptionsH:'Opzioni di Corsa Sicura',rideDisclaimer:'Provider e codici mostrati sono segnaposto. I partner finali devono essere approvati dalle operations di Wilkins Media e dalla sicurezza dell’evento prima del lancio pubblico.',rideWarn:'<strong>Resta al sicuro:</strong> Conferma nome dell’autista, targa, zona di salita e percorso prima di salire. Non accettare passaggi da chi ti avvicina. Condividi il viaggio con un contatto fidato.',rideShare:'Condividi corsa',rideBack:'Torna alla mappa',rideSos:'Emergenza · 911',ride1:'Verifica che il nome dell’autista coincida con quello in app.',ride2:'Verifica che la targa coincida con quella in app.',ride3:'Attendi nella zona di salita segnalata.',ride4:'Conferma il percorso prima della partenza.',ride5:'Condividi la corsa in tempo reale con un contatto fidato.',ride6:'Se qualcosa non va, scendi in un luogo pubblico con personale e usa il pulsante di emergenza.',ucSpeak:'Sei al sicuro. Cammina verso una zona sicura segnalata o chiedi aiuto a personale in divisa. Resta in zone illuminate e affollate. In caso di emergenza, tocca il pulsante rosso 911.',zoneSpeak:'Una zona sicura è indicata sulla tua mappa. Cammina lungo i percorsi segnalati. Cerca personale in divisa.',guideSpeak:'Dirò le indicazioni a voce alta. Cammina al tuo passo normale. Resta su percorsi segnalati e vicino ad altre persone. Se qualcosa non va, tocca il pulsante rosso 911.'},
  ar:{ucT:'مرافق سلامة Tap',ucSub:'هل ضللت الطريق؟ اتبع وحيد القرن إلى منطقة آمنة معلَّمة.',ucListen:'استمع',ucRide:'رحلة موثقة',ucZone:'منطقة آمنة',ucGuide:'سر معي',ucStrip:'دليل سلامة العائلة · متعدد اللغات · متصل بخط Wilkins Safe',rideH:'قائمة فحص الرحلة الموثقة',rideSub:'قبل ركوب أي مركبة، تأكد من كل خطوة. ابقَ مع مجموعتك.',rideOptionsH:'خيارات رحلة آمنة',rideDisclaimer:'مزودو الرحلات والرموز المعروضة هنا للعرض فقط. يجب اعتماد الشركاء النهائيين من قبل عمليات Wilkins Media وأمن الموقع قبل الإطلاق العام.',rideWarn:'<strong>ابق آمناً:</strong> تأكد من اسم السائق، اللوحة، منطقة الركوب والمسار قبل الصعود. لا تقبل توصيلة من شخص يقترب منك أولاً. شارك رحلتك مع شخص تثق به.',rideShare:'مشاركة الرحلة',rideBack:'العودة للخريطة',rideSos:'طوارئ · 911',ride1:'تأكد من تطابق اسم السائق مع التطبيق.',ride2:'تأكد من تطابق رقم اللوحة مع التطبيق.',ride3:'انتظر داخل منطقة الركوب المحددة.',ride4:'تأكد من المسار قبل بدء الرحلة.',ride5:'شارك رحلتك المباشرة مع شخص تثق به.',ride6:'إذا شعرت بأي خطر، انزل في مكان عام به موظفون واستخدم زر الطوارئ.',ucSpeak:'أنت بأمان. سر إلى منطقة آمنة معلَّمة أو اطلب المساعدة من أي موظف بالزي الرسمي. ابقَ في الأماكن المضاءة والمزدحمة. في حالة الطوارئ، اضغط الزر الأحمر 911.',zoneSpeak:'تظهر منطقة آمنة على خريطتك. سر على المسارات المحددة. ابحث عن الموظفين بالزي الرسمي.',guideSpeak:'سأقول لك الاتجاهات بصوت عالٍ. سر بإيقاعك العادي. ابقَ على المسارات المحددة وقرب الناس. إذا شعرت بأي خطر، اضغط الزر الأحمر 911.'},
  zh:{ucT:'Tap 安全伙伴',ucSub:'迷路或不确定？跟随独角兽到标记的安全区。',ucListen:'收听',ucRide:'验证乘车',ucZone:'安全区',ucGuide:'陪你走',ucStrip:'家庭安全指南 · 多语言 · 连接 Wilkins Safe Line',rideH:'验证乘车检查清单',rideSub:'上车前请确认每一步。与你的同伴在一起。',rideOptionsH:'安全乘车选项',rideDisclaimer:'此处显示的乘车提供商和代码仅为占位示例。最终合作伙伴必须由 Wilkins Media 运营和场馆安保在公开发布前批准。',rideWarn:'<strong>保持安全：</strong>上车前请确认司机姓名、车牌、上车点和路线。不要接受主动靠近你的人提供的搭乘。与可信联系人分享行程。',rideShare:'分享行程',rideBack:'返回地图',rideSos:'紧急 · 911',ride1:'核对司机姓名与App一致。',ride2:'核对车牌与App一致。',ride3:'在标记的上车区内等待。',ride4:'出发前确认路线。',ride5:'与可信联系人共享实时行程。',ride6:'若感觉不对，请在有工作人员的公共场所下车，并使用紧急按钮。',ucSpeak:'你很安全。请走到标记的安全区，或向任何穿制服的工作人员求助。停留在明亮、人多的地方。如遇紧急情况，请按红色 911 按钮。',zoneSpeak:'你的地图上显示了一个安全区。请沿标记的路线行走。寻找穿制服的工作人员。',guideSpeak:'我会大声说出方向。按正常速度行走。请走在标记的路径上并靠近他人。如果感觉不对，按红色 911 按钮。'},
  ja:{ucT:'Tap セーフティ・コンパニオン',ucSub:'迷子や不安なときは、ユニコーンに従って表示された安全ゾーンへ。',ucListen:'聞く',ucRide:'認証ライド',ucZone:'安全ゾーン',ucGuide:'一緒に歩こう',ucStrip:'家族向け安全ガイド · 多言語 · Wilkins Safe Line に接続',rideH:'認証ライド・チェックリスト',rideSub:'乗車前にすべての項目を確認してください。グループから離れないでください。',rideOptionsH:'安全なライド選択肢',rideDisclaimer:'ここに表示されるライドプロバイダおよびコードはプレースホルダーです。最終的なパートナーは公開前に Wilkins Media オペレーションと会場警備の承認が必要です。',rideWarn:'<strong>安全のため：</strong>乗車前に運転手の名前、ナンバープレート、乗車エリア、ルートを必ず確認してください。声をかけてきた人の車には絶対に乗らないでください。信頼できる連絡先と乗車を共有してください。',rideShare:'乗車を共有',rideBack:'地図に戻る',rideSos:'緊急 · 911',ride1:'運転手の名前がアプリと一致するか確認。',ride2:'ナンバープレートがアプリと一致するか確認。',ride3:'指定された乗車エリア内で待つ。',ride4:'出発前にルートを確認。',ride5:'信頼できる連絡先にライブの行程を共有。',ride6:'違和感があれば、係員のいる公共の場所で降り、緊急ボタンを使用してください。',ucSpeak:'あなたは安全です。マークされた安全ゾーンへ向かうか、制服を着たスタッフに助けを求めてください。明るく人通りの多い場所にとどまってください。緊急時は赤い 911 ボタンを押してください。',zoneSpeak:'地図に安全ゾーンが表示されています。表示されたルートを歩いてください。制服のスタッフを探してください。',guideSpeak:'声で道順を伝えます。通常のペースで歩いてください。表示された道を歩き、他の人の近くにいてください。何かおかしいと感じたら赤い 911 ボタンを押してください。'},
  ko:{ucT:'Tap 안전 동반자',ucSub:'길을 잃었거나 불안하면, 유니콘을 따라 표시된 안전 구역으로 가세요.',ucListen:'듣기',ucRide:'검증된 라이드',ucZone:'안전 구역',ucGuide:'함께 걷기',ucStrip:'가족 안전 가이드 · 다국어 · Wilkins Safe Line 연결',rideH:'검증된 라이드 체크리스트',rideSub:'차량에 탑승하기 전에 모든 단계를 확인하세요. 일행과 함께 있으세요.',rideOptionsH:'안전한 라이드 옵션',rideDisclaimer:'여기에 표시된 라이드 제공자와 코드는 플레이스홀더입니다. 최종 파트너는 공개 출시 전 Wilkins Media 운영 및 행사 보안의 승인을 받아야 합니다.',rideWarn:'<strong>안전 수칙:</strong> 탑승 전 기사 이름, 번호판, 픽업 구역, 경로를 반드시 확인하세요. 먼저 다가오는 사람의 차는 절대 타지 마세요. 신뢰할 수 있는 연락처와 여정을 공유하세요.',rideShare:'여정 공유',rideBack:'지도로 돌아가기',rideSos:'긴급 · 911',ride1:'기사 이름이 앱과 일치하는지 확인.',ride2:'번호판이 앱과 일치하는지 확인.',ride3:'지정된 픽업 구역에서 대기.',ride4:'출발 전 경로 확인.',ride5:'신뢰할 수 있는 사람과 실시간 여정 공유.',ride6:'이상하면 직원이 있는 공공장소에서 하차하고 긴급 버튼을 사용하세요.',ucSpeak:'당신은 안전합니다. 표시된 안전 구역으로 걸어가거나 제복을 입은 직원에게 도움을 요청하세요. 밝고 사람이 많은 곳에 머물러 있으세요. 긴급 상황에서는 빨간 911 버튼을 누르세요.',zoneSpeak:'지도에 안전 구역이 표시됩니다. 표시된 경로를 따라 걸어가세요. 제복 입은 직원을 찾아보세요.',guideSpeak:'방향을 소리내어 알려드릴게요. 평소 속도로 걸으세요. 표시된 길에서 다른 사람들 가까이 머무르세요. 이상하면 빨간 911 버튼을 누르세요.'}
};

// SAFE RIDE OPTIONS — placeholders. Verified-pickup-zone-only references; no third-party deep links
// or promo codes until ops/security signs off. URLs use `tel:` to Wilkins Safe Line so the user
// always lands on a staffed channel rather than an unverified external app.
const RIDE_OPTIONS = [
  { id:'rideshare-zone',  name:'Rideshare · Verified Pickup Zone', sub:'Open your rideshare app, then walk to the marked Wilkins pickup zone before getting in.', badge:'PLACEHOLDER', icon:'ride', url:'tel:18888273432' },
  { id:'official-shuttle', name:'Match-Day Shuttle (Official)',     sub:'Routes and times to be confirmed by venue operations.', badge:'PLACEHOLDER', icon:'ride', url:'tel:18888273432' },
  { id:'wilkins-walk',    name:'Wilkins Walking Escort',            sub:'Trained host walks you from a safe zone to your gate.',  badge:'STAFF',       icon:'guide', url:'tel:18888273432' },
  { id:'staffed-transit', name:'Staffed Transit Hub',                sub:'Use only stations with visible uniformed staff and CCTV.', badge:'GUIDANCE',  icon:'zone', url:'tel:18888273432' }
];

const RIDE_CHECKLIST_KEYS = ['ride1','ride2','ride3','ride4','ride5','ride6'];

function ucT(k){ return (UNICORN_I18N[lang] && UNICORN_I18N[lang][k]) || UNICORN_I18N.en[k]; }
function applyUnicornLang(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n;
    if (UNICORN_I18N.en && UNICORN_I18N.en[k] != null) el.innerHTML = ucT(k);
  });
  // Also keep aria-labels updated for screen readers
  const map = {
    ucSpeakBtn:'ucListen', ucRideBtn:'ucRide', ucZoneBtn:'ucZone', ucGuideBtn:'ucGuide',
    rideShareBtn:'rideShare', rideBackBtn:'rideBack'
  };
  Object.entries(map).forEach(([id,k])=>{
    const el = document.getElementById(id);
    if (el && UNICORN_I18N.en[k]) el.setAttribute('aria-label', stripTags(ucT(k)));
  });
}
function stripTags(s){ return String(s).replace(/<[^>]+>/g,''); }

function buildRideChecklist(){
  const el = document.getElementById('rideChecklist'); if (!el) return;
  el.innerHTML = RIDE_CHECKLIST_KEYS.map((k,i)=>`<li><span class="num" aria-hidden="true">${i+1}</span><span>${ucT(k)}</span></li>`).join('');
}
function buildRideOptions(){
  const wrap = document.getElementById('rideOptions'); if (!wrap) return;
  wrap.innerHTML = RIDE_OPTIONS.map(r=>`
    <a class="opt" href="${r.url}" rel="noreferrer" aria-label="${stripTags(r.name)} — ${stripTags(r.sub)}">
      <div class="ic" aria-hidden="true"><svg><use href="#icon-${r.icon}"/></svg></div>
      <div class="body">
        <div class="t">${r.name} <span class="badge">${r.badge}</span></div>
        <div class="s">${r.sub}</div>
      </div>
    </a>`).join('');
}

let __rideLastFocus = null;
function openRide(){
  buildRideChecklist();
  buildRideOptions();
  const m = document.getElementById('rideModal');
  __rideLastFocus = document.activeElement;
  m.classList.add('show');
  speak(ucT('ucSpeak'), lang);
  // Move focus into sheet for keyboard users
  setTimeout(()=>{ const x = m.querySelector('.x'); if (x) x.focus(); }, 30);
}
function closeRide(){
  document.getElementById('rideModal').classList.remove('show');
  try{ if (__voiceAudio) __voiceAudio.pause(); }catch(_){}
  try{ if (__rideLastFocus) __rideLastFocus.focus(); }catch(_){}
}
window.closeRide = closeRide;

async function shareTrip(){
  const text = 'I am using the Tap FIFA Safety Companion. If you do not hear back, contact Wilkins Safe Line: 1-888-827-3432.';
  try{
    if (navigator.share){ await navigator.share({title:'Tap FIFA · Trip share', text}); return; }
  }catch(_){ /* user cancelled */ }
  try{ await navigator.clipboard.writeText(text); alert('Trip-share message copied. Send it to a trusted contact.'); }
  catch(_){ window.location.href = 'sms:?body=' + encodeURIComponent(text); }
}

function wireUnicorn(){
  applyUnicornLang();
  const langSel = document.getElementById('lang');
  if (langSel) langSel.addEventListener('change', ()=>setTimeout(()=>{
    applyUnicornLang(); buildRideChecklist(); buildRideOptions();
  },0));

  const speakBtn = document.getElementById('ucSpeakBtn');
  const rideBtn  = document.getElementById('ucRideBtn');
  const zoneBtn  = document.getElementById('ucZoneBtn');
  const guideBtn = document.getElementById('ucGuideBtn');

  if (speakBtn) speakBtn.addEventListener('click', ()=> speak(ucT('ucSpeak'), lang));
  if (rideBtn)  rideBtn.addEventListener('click',  openRide);
  if (zoneBtn)  zoneBtn.addEventListener('click',  ()=>{
    speak(ucT('zoneSpeak'), lang);
    document.getElementById('map').scrollIntoView({behavior:'smooth',block:'center'});
  });
  if (guideBtn) guideBtn.addEventListener('click', ()=>{
    speak(ucT('guideSpeak'), lang);
    document.getElementById('map').scrollIntoView({behavior:'smooth',block:'center'});
  });

  const shareBtn = document.getElementById('rideShareBtn');
  const backBtn  = document.getElementById('rideBackBtn');
  if (shareBtn) shareBtn.addEventListener('click', shareTrip);
  if (backBtn)  backBtn.addEventListener('click',  ()=>{ closeRide(); document.getElementById('map').scrollIntoView({behavior:'smooth',block:'center'}); });

  const rm = document.getElementById('rideModal');
  if (rm) rm.addEventListener('click', e=>{ if (e.target.id==='rideModal') closeRide(); });

  // Esc closes ride sheet
  document.addEventListener('keydown', e=>{
    if (e.key === 'Escape' && rm && rm.classList.contains('show')) closeRide();
  });
}
