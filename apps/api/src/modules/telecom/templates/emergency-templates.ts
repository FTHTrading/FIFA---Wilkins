const EMERGENCY_COPY: Record<string, Record<string, string>> = {
  call_ambulance: {
    en: 'Medical emergency detected. If immediate danger, call 911 now.',
    es: 'Emergencia medica detectada. Si hay peligro inmediato, llama al 911 ahora.',
    pt: 'Emergencia medica detectada. Se houver perigo imediato, ligue 911 agora.',
    fr: 'Urgence medicale detectee. En cas de danger immediat, appelez le 911 maintenant.',
    ar: 'Medical emergency detected. If immediate danger, call 911 now.',
  },
  call_police: {
    en: 'Police support requested. If immediate danger, call 911 now.',
    es: 'Soporte policial solicitado. Si hay peligro inmediato, llama al 911 ahora.',
    pt: 'Suporte policial solicitado. Se houver perigo imediato, ligue 911 agora.',
    fr: 'Assistance policiere demandee. En cas de danger immediat, appelez le 911.',
    ar: 'Police support requested. If immediate danger, call 911 now.',
  },
  lost_child: {
    en: 'Lost child protocol activated. Stay in place if safe. Staff is being routed to you.',
    es: 'Protocolo de nino perdido activado. Permanece en el lugar si es seguro. El personal va hacia ti.',
    pt: 'Protocolo de crianca perdida ativado. Permaneça no local se for seguro. A equipe esta a caminho.',
    fr: 'Protocole enfant perdu active. Restez sur place si c est securitaire. Le personnel est en route.',
    ar: 'Lost child protocol activated. Stay in place if safe. Staff is being routed to you.',
  },
  i_am_lost: {
    en: 'You are not alone. We are routing staff help and directions now.',
    es: 'No estas solo. Estamos enviando ayuda y direcciones ahora.',
    pt: 'Voce nao esta sozinho. Estamos enviando ajuda e direcoes agora.',
    fr: 'Vous n etes pas seul. Nous envoyons de l aide et des directions maintenant.',
    ar: 'You are not alone. We are routing staff help and directions now.',
  },
};

export function renderEmergencyTemplate(phraseKey: string, language: string): string {
  const fallbackPack = EMERGENCY_COPY.call_ambulance as Record<string, string>;
  const pack = (EMERGENCY_COPY[phraseKey] ?? EMERGENCY_COPY.i_am_lost ?? fallbackPack) as Record<string, string>;

  if (pack[language]) return pack[language];
  if (pack.en) return pack.en;
  if (fallbackPack.en) return fallbackPack.en;

  return 'Medical emergency detected. If immediate danger, call 911 now.';
}
