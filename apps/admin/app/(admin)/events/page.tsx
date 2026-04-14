import { Badge } from '@wilkins/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@wilkins/ui';

const MOCK_EVENTS = [
  { id: '1', name: 'Atlanta 2026 World Cup Fan Experience', slug: 'atlanta-2026', status: 'PUBLISHED', startsAt: '2026-06-01', endsAt: '2026-07-13', sessions: 12400, languages: 10 },
  { id: '2', name: 'Demo Event', slug: 'demo', status: 'DRAFT', startsAt: '2025-12-01', endsAt: '2025-12-05', sessions: 0, languages: 3 },
];

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  LIVE: 'success',
  PUBLISHED: 'info',
  DRAFT: 'default',
  COMPLETED: 'warning',
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Events</h1>
          <p className="text-sm text-brand-muted mt-0.5">Manage event configurations</p>
        </div>
        <button className="px-4 py-2 bg-brand-gold text-brand-black rounded-lg text-sm font-semibold hover:bg-brand-gold-light transition-colors">
          + New Event
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Event</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Dates</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Languages</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Sessions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-brand-surface/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{event.name}</p>
                    <p className="text-xs text-brand-muted font-mono">{event.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs">
                    {event.startsAt} → {event.endsAt}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[event.status] ?? 'default'}>{event.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white">{event.languages}</td>
                  <td className="px-4 py-3 text-white">{event.sessions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
