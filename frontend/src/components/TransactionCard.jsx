import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionCard({ transaction }) {
  const isIn = transaction.type === 'IN';
  const date = new Date(transaction.date);
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="card flex items-center gap-3 mb-2 active:scale-[0.98] transition-transform">
      <div className={`p-2.5 rounded-xl ${isIn ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        {isIn
          ? <ArrowDownRight size={20} className="text-emerald-600" />
          : <ArrowUpRight size={20} className="text-rose-600" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">
          {transaction.description || (isIn ? 'Sale' : 'Expense')}
        </p>
        {transaction.ledger?.name && (
          <p className="text-sm text-slate-500 truncate">{transaction.ledger.name}</p>
        )}
        <p className="text-xs text-slate-400">{dateStr} · {timeStr}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isIn ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
