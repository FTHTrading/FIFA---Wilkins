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
function speakPhrase(key, l){
  const p = PHRASES.find(x=>x.key===key);
  const text = p[l] || p.en;
  if (!('speechSynthesis' in window)) { alert(text); return; }
  const u = new SpeechSynthesisUtterance(text);
  const map = {en:'en-US',es:'es-ES',pt:'pt-BR',fr:'fr-FR',de:'de-DE',it:'it-IT',ar:'ar-SA',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR'};
  u.lang = map[l] || 'en-US';
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
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
}
function divIcon(emoji, color){
  return L.divIcon({
    html:`<div style="background:${color};color:#fff;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:.95rem;box-shadow:0 4px 12px rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.4)">${emoji}</div>`,
    className:'', iconSize:[30,30], iconAnchor:[15,15]
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
});
