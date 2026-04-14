import { Badge } from '@wilkins/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@wilkins/ui';

const MOCK_TRANSLATIONS = [
  {
    id: '1',
    key: 'emergency.call_ambulance',
    source: 'I need an ambulance',
    target: 'Necesito una ambulancia',
    lang: 'es',
    confidence: 0.97,
    status: 'APPROVED',
    provider: 'azure',
  },
  {
    id: '2',
    key: 'concierge.nearby',
    source: 'Nearest restaurants to the venue',
    target: 'المطاعم الأقرب إلى مكان الحدث',
    lang: 'ar',
    confidence: 0.72,
    status: 'NEEDS_REVIEW',
    provider: 'azure',
  },
  {
    id: '3',
    key: 'map.gate_a',
    source: 'Main Entrance Gate A',
    target: 'Portail d\'entrée principal A',
    lang: 'fr',
    confidence: 0.91,
    status: 'APPROVED',
    provider: 'deepl',
  },
];

function ConfidenceBadge({ value }: { value: number }) {
  if (value >= 0.9) return <Badge variant="success">{Math.round(value * 100)}%</Badge>;
  if (value >= 0.7) return <Badge variant="warning">{Math.round(value * 100)}%</Badge>;
  return <Badge variant="danger">{Math.round(value * 100)}%</Badge>;
}

export default function TranslationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Translation Review</h1>
        <p className="text-sm text-brand-muted mt-0.5">Review and approve AI-generated translations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Review ({MOCK_TRANSLATIONS.filter(t => t.status === 'NEEDS_REVIEW').length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Key</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Source</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Translation</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Lang</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Confidence</th>
                <th className="text-left text-xs font-medium text-brand-muted uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {MOCK_TRANSLATIONS.map((t) => (
                <tr key={t.id} className="hover:bg-brand-surface/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-brand-muted">{t.key}</td>
                  <td className="px-4 py-3 text-brand-text max-w-xs truncate">{t.source}</td>
                  <td className="px-4 py-3 text-white max-w-xs truncate">{t.target}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="uppercase text-2xs">{t.lang}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge value={t.confidence} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.status === 'APPROVED' ? 'success' : t.status === 'NEEDS_REVIEW' ? 'warning' : 'danger'}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
