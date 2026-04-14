const MOCK_QUEUE = [
  {
    id: 'req-001',
    guestLang: 'Arabic',
    flag: '🇸🇦',
    message: 'أحتاج مساعدة في الوصول إلى البوابة A',
    translated: 'I need help getting to Gate A',
    intent: 'Directions',
    zone: 'Gate District',
    time: '2 min ago',
    priority: 'normal' as const,
  },
  {
    id: 'req-002',
    guestLang: 'Spanish',
    flag: '🇲🇽',
    message: '¿Dónde puedo encontrar comida halal cerca?',
    translated: 'Where can I find halal food nearby?',
    intent: 'Food & Dining',
    zone: 'Centennial Park',
    time: '4 min ago',
    priority: 'normal' as const,
  },
  {
    id: 'req-003',
    guestLang: 'Japanese',
    flag: '🇯🇵',
    message: '子供が迷子になりました。助けてください。',
    translated: 'My child is lost. Please help.',
    intent: 'Emergency',
    zone: 'Stadium Interior',
    time: '1 min ago',
    priority: 'urgent' as const,
  },
  {
    id: 'req-004',
    guestLang: 'Portuguese',
    flag: '🇧🇷',
    message: 'Como chego ao lounge VIP da Delta?',
    translated: 'How do I get to the Delta VIP lounge?',
    intent: 'Transport',
    zone: 'Stadium Interior',
    time: '6 min ago',
    priority: 'normal' as const,
  },
  {
    id: 'req-005',
    guestLang: 'Korean',
    flag: '🇰🇷',
    message: '가장 가까운 화장실이 어디인가요?',
    translated: 'Where is the nearest restroom?',
    intent: 'Directions',
    zone: 'Gate District',
    time: '8 min ago',
    priority: 'normal' as const,
  },
];

export default function QueuePage() {
  return (
    <main className="min-h-screen bg-brand-black p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Translation Queue</h1>
          <p className="text-brand-muted text-sm">Live guest assistance requests</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-muted font-medium">{MOCK_QUEUE.length} pending</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-success/15 px-3 py-1 text-xs font-medium text-brand-success">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-success animate-pulse" />
            Connected
          </span>
        </div>
      </header>

      <div className="space-y-3">
        {MOCK_QUEUE.map((req) => (
          <div
            key={req.id}
            className={`rounded-xl border bg-brand-surface p-5 transition-colors hover:border-brand-gold/40 ${
              req.priority === 'urgent'
                ? 'border-brand-danger/50 shadow-[0_0_12px_rgba(239,68,68,0.12)]'
                : 'border-brand-border'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{req.flag}</span>
                  <span className="text-sm font-medium text-white">{req.guestLang}</span>
                  <span className="text-xs text-brand-muted">·</span>
                  <span className="text-xs text-brand-muted">{req.zone}</span>
                  <span className="text-xs text-brand-muted">·</span>
                  <span className="text-xs text-brand-muted">{req.time}</span>
                  {req.priority === 'urgent' && (
                    <span className="ml-auto inline-flex items-center rounded-full bg-brand-danger/15 px-2 py-0.5 text-2xs font-bold text-brand-danger uppercase tracking-wider animate-pulse">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-brand-muted mb-1 truncate" dir={req.guestLang === 'Arabic' ? 'rtl' : 'ltr'}>
                  {req.message}
                </p>
                <p className="text-sm text-white">{req.translated}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center rounded-full bg-brand-electric/15 px-2.5 py-0.5 text-xs font-medium text-brand-electric">
                  {req.intent}
                </span>
                <button className="rounded-lg bg-brand-success px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-success/80">
                  Respond
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
