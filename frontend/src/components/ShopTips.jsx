import { Lightbulb } from 'lucide-react';
import { generateTips } from '../utils/insights';

export default function ShopTips({ stats, transactions }) {
  const tips = generateTips(stats, transactions);
  if (tips.length === 0) return null;

  return (
    <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-amber-600" />
        <h3 className="font-bold text-amber-800 text-sm">Shop Tips</h3>
      </div>
      <div className="space-y-2">
        {tips.slice(0, 3).map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-base">{tip.emoji}</span>
            <p className="text-amber-900/80">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
