const TEMPLATE_DB: Record<string, Record<string, string>> = {
  welcome: {
    en: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    es: 'Necesitas ayuda, direcciones, comida, recompensas o soporte de emergencia? Texto FIFA: +1-888-827-3432',
    pt: 'Precisa de ajuda, direcoes, comida, recompensas ou suporte de emergencia? Envie FIFA: +1-888-827-3432',
    fr: 'Besoin d aide, directions, nourriture, recompenses ou assistance d urgence? Envoyez FIFA: +1-888-827-3432',
    ar: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    ja: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    ko: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    'zh-CN': 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    de: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
    it: 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432',
  },
  fallback: {
    en: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    es: 'Puedo ayudar con comida, direcciones, banos, transporte, recompensas, ofertas y soporte de emergencia. Responde con lo que necesitas.',
    pt: 'Posso ajudar com comida, direcoes, banheiro, transporte, recompensas, ofertas e suporte de emergencia. Responda com o que precisa.',
    fr: 'Je peux aider pour la nourriture, directions, toilettes, transport, recompenses, offres et urgence. Repondez avec votre besoin.',
    ar: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    ja: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    ko: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    'zh-CN': 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    de: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
    it: 'I can help with food, directions, restroom, transport, rewards, offers, and emergency support. Reply with what you need.',
  },
  escalation_ack: {
    en: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    es: 'El soporte de emergencia ha sido alertado. Permanece donde estas si es seguro y mantente disponible por este telefono.',
    pt: 'O suporte de emergencia foi alertado. Fique onde esta se for seguro e mantenha este telefone disponivel.',
    fr: 'Le support d urgence a ete alerte. Restez sur place si c est securitaire et gardez ce telephone disponible.',
    ar: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    ja: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    ko: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    'zh-CN': 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    de: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
    it: 'Emergency support has been alerted. Stay where you are if safe and keep this phone available.',
  },
};

export const SUPPORTED_SMS_LANGUAGES = [
  'en',
  'es',
  'fr',
  'pt',
  'ar',
  'ja',
  'ko',
  'zh-CN',
  'de',
  'it',
] as const;

export function resolveSmsTemplate(templateKey: keyof typeof TEMPLATE_DB, language: string): string {
  const fallbackPack = TEMPLATE_DB.fallback as Record<string, string>;
  const pack = (TEMPLATE_DB[templateKey] ?? fallbackPack) as Record<string, string>;

  if (pack[language]) return pack[language];
  if (pack.en) return pack.en;
  if (fallbackPack.en) return fallbackPack.en;

  return 'Need help, directions, food, rewards, or emergency support? Text FIFA: +1-888-827-3432';
}
