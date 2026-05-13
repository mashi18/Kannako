import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { ArrowLeft, Users } from 'lucide-react';
import TransactionCard from '../components/TransactionCard';

export default function LedgerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTransactions, transactions, fetchLedgers, ledgers } = useTransactions();
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ledgersData = ledgers.length > 0 ? ledgers : await fetchLedgers();
      const found = ledgersData.find(l => l._id === id);
      setLedger(found);
      fetchTransactions({ ledgerId: id, limit: 50 });
    };
    load();
  }, [id]);

  const isPositive = ledger ? ledger.balance >= 0 : true;
  const absBalance = ledger ? Math.abs(ledger.balance) : 0;
  const ledgerTxns = transactions.filter(t => t.ledger?._id === id || t.ledger === id);

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/ledger')} className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
        <ArrowLeft size={18} /> Back
      </button>

      {ledger && (
        <div className={`card text-center ${isPositive ? 'bg-gradient-to-br from-emerald-50' : 'bg-gradient-to-br from-rose-50'}`}>
          <div className={`inline-flex p-3 rounded-2xl mb-2 ${isPositive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            <Users size={28} className={isPositive ? 'text-emerald-600' : 'text-rose-600'} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{ledger.name}</h2>
          {ledger.phone && <p className="text-sm text-slate-500">{ledger.phone}</p>}
          <div className="mt-3">
            <p className="text-3xl font-extrabold">
              <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                {isPositive ? '+' : '-'}₹{absBalance.toLocaleString()}
              </span>
            </p>
            <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? `${ledger.name} owes you` : `You owe ${ledger.name}`}
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-slate-800 mb-2">Transactions</h3>
        {ledgerTxns.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No transactions with this customer yet</p>
        ) : (
          ledgerTxns.map(txn => <TransactionCard key={txn._id} transaction={txn} />)
        )}
      </div>
    </div>
  );
}
