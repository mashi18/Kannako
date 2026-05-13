import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { LogOut, IndianRupee, Users, TrendingUp, TrendingDown, WifiOff } from 'lucide-react';
import QuickAdd from '../components/QuickAdd';
import ShopTips from '../components/ShopTips';
import TransactionCard from '../components/TransactionCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { stats, transactions, fetchStats, fetchTransactions, pendingSync } = useTransactions();

  useEffect(() => {
    fetchStats();
    fetchTransactions({ limit: 5 });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Namaste, {user?.name?.split(' ')[0] || 'Shopkeeper'} 👋
          </h1>
          {user?.shopName && (
            <p className="text-sm text-slate-500">{user.shopName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pendingSync > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-full">
              <WifiOff size={14} />
              {pendingSync}
            </div>
          )}
          <button onClick={logout} className="p-2.5 rounded-xl bg-slate-100 text-slate-600 active:bg-slate-200 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <QuickAdd />

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">Today's Sale</p>
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">₹{stats.today?.totalIn?.toLocaleString() || '0'}</p>
            <p className="text-xs text-emerald-500">{stats.today?.count || 0} entries</p>
          </div>
          <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee size={16} className="text-amber-600" />
              <p className="text-xs font-medium text-amber-700">Receivable</p>
            </div>
            <p className="text-2xl font-extrabold text-amber-700">₹{stats.totalReceivable?.toLocaleString() || '0'}</p>
            <p className="text-xs text-amber-500">{stats.customerCount} customers</p>
          </div>
          <div className="card bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={16} className="text-rose-600" />
              <p className="text-xs font-medium text-rose-700">Today's Expense</p>
            </div>
            <p className="text-2xl font-extrabold text-rose-700">₹{stats.today?.totalOut?.toLocaleString() || '0'}</p>
            <p className="text-xs text-rose-500">{stats.today?.count || 0} entries</p>
          </div>
          <div className="card bg-gradient-to-br from-kanakko-50 to-indigo-50 border border-kanakko-200/50">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-kanakko-600" />
              <p className="text-xs font-medium text-kanakko-700">Payable</p>
            </div>
            <p className="text-2xl font-extrabold text-kanakko-700">₹{stats.totalPayable?.toLocaleString() || '0'}</p>
            <p className="text-xs text-kanakko-500">you owe</p>
          </div>
        </div>
      )}

      <ShopTips stats={stats} transactions={transactions} />

      <div>
        <h3 className="font-bold text-slate-800 mb-2">Recent Activity</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No entries yet. Tap the + to add your first entry!</p>
        ) : (
          transactions.map(txn => <TransactionCard key={txn._id} transaction={txn} />)
        )}
      </div>
    </div>
  );
}
