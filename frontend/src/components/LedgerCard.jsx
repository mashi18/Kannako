import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

export default function LedgerCard({ ledger }) {
  const navigate = useNavigate();
  const isPositive = ledger.balance >= 0;
  const absBalance = Math.abs(ledger.balance);

  return (
    <div
      onClick={() => navigate(`/ledger/${ledger._id}`)}
      className="card flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className={`p-3 rounded-xl ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
        <Users size={22} className={isPositive ? 'text-emerald-600' : 'text-rose-600'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 truncate">{ledger.name}</p>
        <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive
            ? `${ledger.name} owes you ₹${absBalance.toLocaleString()}`
            : `You owe ${ledger.name} ₹${absBalance.toLocaleString()}`
          }
        </p>
      </div>
      <div className="text-right">
        <p className={`font-extrabold text-lg ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '+' : '-'}₹{absBalance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
