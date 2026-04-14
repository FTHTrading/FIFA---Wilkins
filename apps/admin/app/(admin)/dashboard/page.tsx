import { Card, CardContent, CardHeader, CardTitle } from '@wilkins/ui';
import { Badge } from '@wilkins/ui';

// Stat card component
function StatCard({ label, value, delta, trend }: {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card variant="elevated">
      <CardContent className="pt-5">
        <p className="text-xs font-medium text-brand-muted uppercase tracking-widest mb-1">{label}</p>
        <p className="font-display text-3xl font-bold text-white">{value}</p>
        {delta && (
          <p className={`text-xs mt-1 font-medium ${
            trend === 'up' ? 'text-brand-success' :
            trend === 'down' ? 'text-brand-danger' :
            'text-brand-muted'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {delta} vs. yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
}

const RECENT_SESSIONS = [
  { lang: 'Spanish', sessions: 1243, pct: 32 },
  { lang: 'Arabic', sessions: 876, pct: 22 },
  { lang: 'French', sessions: 654, pct: 17 },
  { lang: 'Portuguese', sessions: 521, pct: 13 },
  { lang: 'Japanese', sessions: 312, pct: 8 },
  { lang: 'Korean', sessions: 198, pct: 5 },
  { lang: 'Other', sessions: 120, pct: 3 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-brand-muted mt-0.5">Atlanta 2026 — Live Event Overview</p>
        </div>
        <Badge variant="success" className="text-xs">● LIVE</Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Sessions" value="3,924" delta="+18%" trend="up" />
        <StatCard label="Languages in Use" value="10" delta="All active" trend="neutral" />
        <StatCard label="Translations Today" value="12,481" delta="+34%" trend="up" />
        <StatCard label="Open Incidents" value="2" delta="-1 resolved" trend="up" />
      </div>

      {/* Language breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_SESSIONS.map((item) => (
                <div key={item.lang}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-text">{item.lang}</span>
                    <span className="text-brand-muted">{item.sessions.toLocaleString()} ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold rounded-full transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'Medical Help', time: '14:32', status: 'resolved', lang: 'Arabic' },
                { key: 'Lost Child', time: '14:18', status: 'active', lang: 'Spanish' },
                { key: 'Lost', time: '13:55', status: 'resolved', lang: 'Japanese' },
              ].map((incident, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{incident.key}</p>
                    <p className="text-xs text-brand-muted">{incident.lang} · {incident.time}</p>
                  </div>
                  <Badge variant={incident.status === 'active' ? 'warning' : 'success'}>
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
