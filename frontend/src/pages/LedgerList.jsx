import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Search, UserPlus } from 'lucide-react';
import LedgerCard from '../components/LedgerCard';

export default function LedgerList() {
  const { ledgers, fetchLedgers, createLedger } = useTransactions();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => { fetchLedgers(); }, []);

  const handleSearch = (val) => {
    setSearch(val);
    fetchLedgers(val);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createLedger(newName.trim(), newPhone);
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    } catch {}
  };

  const filtered = ledgers.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Khata</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-kanakko-600 bg-kanakko-50 px-3 py-2 rounded-xl active:bg-kanakko-100 transition-colors"
        >
          <UserPlus size={18} /> New
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search customer..."
        />
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card space-y-3">
          <h3 className="font-bold text-slate-800">Add Customer</h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input-field"
            placeholder="Customer name"
            autoFocus
          />
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
            className="input-field"
            placeholder="Phone (optional)"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 text-sm">Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 font-medium">No customers yet</p>
          <p className="text-sm text-slate-300 mt-1">Add a customer to start tracking udhaar</p>
        </div>
      ) : (
        filtered.map(l => <LedgerCard key={l._id} ledger={l} />)
      )}
    </div>
  );
}
