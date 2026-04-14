import { Badge } from '@wilkins/ui';

type AlertSeverity = 'critical' | 'warning' | 'info';

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  body: string;
  postedAt: string;
  source: string;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    severity: 'info',
    title: 'Gate C now open',
    body: 'Additional entry lanes at Gate C are now open. Expect reduced wait times.',
    postedAt: '2026-07-12T14:30:00Z',
    source: 'Event Operations',
  },
  {
    id: '2',
    severity: 'warning',
    title: 'Parking lot B at capacity',
    body: 'Parking lot B is full. Please proceed to lots D or E via the northern entrance road.',
    postedAt: '2026-07-12T13:45:00Z',
    source: 'Parking & Transit',
  },
  {
    id: '3',
    severity: 'info',
    title: 'Fan zone hours extended',
    body: 'The main fan zone will remain open until 11 PM tonight. Enjoy the festivities!',
    postedAt: '2026-07-12T12:00:00Z',
    source: 'Fan Experience',
  },
];

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  { badge: 'danger' | 'warning' | 'info'; icon: string; border: string }
> = {
  critical: { badge: 'danger', icon: '🚨', border: 'border-l-brand-emergency' },
  warning: { badge: 'warning', icon: '⚠️', border: 'border-l-brand-warning' },
  info: { badge: 'info', icon: 'ℹ️', border: 'border-l-brand-electric' },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-brand-black pb-8">
      {/* Page header */}
      <div className="sticky top-0 z-10 bg-brand-navy border-b border-brand-border px-4 py-4">
        <h1 className="font-display font-bold text-xl text-white">Venue Alerts</h1>
        <p className="text-sm text-brand-muted mt-0.5">
          {MOCK_ALERTS.length} active update{MOCK_ALERTS.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {MOCK_ALERTS.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          return (
            <div
              key={alert.id}
              className={`bg-brand-surface rounded-xl border border-brand-border border-l-4 ${config.border} p-4`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{config.icon}</span>
                  <h2 className="font-semibold text-white text-sm">{alert.title}</h2>
                </div>
                <Badge variant={config.badge} className="shrink-0 text-2xs uppercase">
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-brand-muted leading-relaxed">{alert.body}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-brand-muted">{alert.source}</span>
                <span className="text-xs text-brand-muted">{timeAgo(alert.postedAt)}</span>
              </div>
            </div>
          );
        })}

        {MOCK_ALERTS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">✅</span>
            <h2 className="font-display font-semibold text-white text-lg mb-2">All clear</h2>
            <p className="text-brand-muted text-sm">No active alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
