import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';

export default function Analytics() {
  const { stats, fetchStats, transactions, fetchTransactions } = useTransactions();
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTransactions({ limit: 100 });
  }, []);

  useEffect(() => {
    if (transactions.length === 0) return;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = days[d.getDay()];
      if (!dayMap[key]) dayMap[key] = { name: key, IN: 0, OUT: 0 };
      dayMap[key][t.type] += t.amount;
    });
    setWeekData(days.filter(d => dayMap[d]).map(d => dayMap[d]));
  }, [transactions]);

  const pieData = [
    { name: 'Cash', value: transactions.filter(t => t.paymentMode === 'cash').length || 1 },
    { name: 'Udhaar', value: transactions.filter(t => t.paymentMode === 'udhaar').length || 1 },
    { name: 'Online', value: transactions.filter(t => t.paymentMode === 'online').length || 1 },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#6366f1'];

  const monthlyNet = stats?.month ? stats.month.totalIn - stats.month.totalOut : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Analytics</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-xs font-medium text-slate-500 mb-1">This Month</p>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <TrendingUp size={16} />
            <span className="text-lg font-extrabold">₹{stats?.month?.totalIn?.toLocaleString() || '0'}</span>
          </div>
          <p className="text-xs text-emerald-500">Income</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium text-slate-500 mb-1">This Month</p>
          <div className="flex items-center gap-1.5 text-rose-600">
            <TrendingDown size={16} />
            <span className="text-lg font-extrabold">₹{stats?.month?.totalOut?.toLocaleString() || '0'}</span>
          </div>
          <p className="text-xs text-rose-500">Expense</p>
        </div>
      </div>

      <div className={`card ${monthlyNet >= 0 ? 'bg-gradient-to-br from-emerald-50' : 'bg-gradient-to-br from-rose-50'}`}>
        <div className="flex items-center gap-2">
          <IndianRupee size={20} className={monthlyNet >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
          <div>
            <p className="text-xs font-medium text-slate-500">Net Monthly</p>
            <p className={`text-2xl font-extrabold ${monthlyNet >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {monthlyNet >= 0 ? '+' : '-'}₹{Math.abs(monthlyNet).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {weekData.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-sm text-slate-800 mb-3">Weekly Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="IN" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="OUT" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {pieData.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-sm text-slate-800 mb-3">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3 className="font-bold text-sm text-slate-800 mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Customers</span>
            <span className="font-bold">{stats?.customerCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Receivable (Udhaar)</span>
            <span className="font-bold text-emerald-600">₹{stats?.totalReceivable?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payable</span>
            <span className="font-bold text-rose-600">₹{stats?.totalPayable?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Week Income</span>
            <span className="font-bold">₹{stats?.week?.totalIn?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Month Income</span>
            <span className="font-bold">₹{stats?.month?.totalIn?.toLocaleString() || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
