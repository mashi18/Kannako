import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { Mic, Camera, ArrowLeft, Check } from 'lucide-react';
import VoiceEntry from '../components/VoiceEntry';
import OCRScanner from '../components/OCRScanner';

export default function AddEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addTransaction, createLedger, ledgers, fetchLedgers } = useTransactions();
  const [type, setType] = useState(location.state?.presetType || 'IN');
  const [amount, setAmount] = useState(location.state?.presetAmount || '');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [showVoice, setShowVoice] = useState(location.state?.openVoice || false);
  const [showScanner, setShowScanner] = useState(location.state?.openScanner || false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const descRef = useRef(null);

  useEffect(() => {
    if (ledgers.length === 0) fetchLedgers();
  }, []);

  useEffect(() => { descRef.current?.focus(); }, []);

  const handleVoiceResult = ({ type: vType, amount: vAmount, description: vDesc }) => {
    setType(vType);
    setAmount(vAmount.toString());
    setDescription(vDesc);
    setShowVoice(false);
  };

  const handleAmountExtracted = (amt) => {
    setAmount(amt.toString());
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setError('');
    setSaving(true);
    try {
      let ledgerId = location.state?.ledgerId;
      if (!ledgerId && customerName) {
        const existing = ledgers.find(l => l.name.toLowerCase() === customerName.toLowerCase());
        if (existing) {
          ledgerId = existing._id;
        } else {
          const newLedger = await createLedger(customerName.trim());
          ledgerId = newLedger._id;
        }
      }
      await addTransaction({
        ledgerId,
        type,
        amount: parseFloat(amount),
        description: description || (type === 'IN' ? 'Sale' : 'Expense'),
        paymentMode,
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) { setError(err?.message || 'Failed to add entry'); setSaving(false); }
  };

  if (showVoice) return <VoiceEntry onResult={handleVoiceResult} onClose={() => setShowVoice(false)} />;
  if (showScanner) return <OCRScanner onAmountExtracted={handleAmountExtracted} onClose={() => setShowScanner(false)} />;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Check size={32} className="text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">Entry Added!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 pt-4 pb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="card">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setType('IN')}
              className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
                type === 'IN' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Got Money
            </button>
            <button
              onClick={() => setType('OUT')}
              className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
                type === 'OUT' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Paid Out
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-3">{error}</p>
          )}

          <div className="mb-4">
            <div className={`text-5xl font-extrabold text-center tracking-tight transition-colors ${
              type === 'IN' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              ₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[100, 500, 1000, 5000].map(val => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm active:bg-slate-200 transition-colors"
              >
                ₹{val.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Amount</label>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field text-2xl font-bold"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Description</label>
              <input
                ref={descRef}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder={type === 'IN' ? 'e.g. Cash sale, Payment received' : 'e.g. Milk, Vegetables, Stock'}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Customer <span className="text-slate-400">(optional)</span></label>
              <div className="relative">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => { setCustomerName(e.target.value); setShowNewCustomer(true); }}
                  className="input-field"
                  placeholder="Search or add customer"
                />
                {customerName && showNewCustomer && !ledgers.find(l => l.name.toLowerCase() === customerName.toLowerCase()) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-100 z-10">
                    <button
                      onClick={() => setShowNewCustomer(false)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-kanakko-600 hover:bg-slate-50 rounded-xl"
                    >
                      + Add "{customerName}" as new customer
                    </button>
                  </div>
                )}
              </div>
              {ledgers.length > 0 && !customerName && (
                <div className="mt-2">
                  <p className="text-xs text-slate-400 mb-1">Recent customers:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ledgers.slice(0, 5).map(l => (
                      <button
                        key={l._id}
                        onClick={() => setCustomerName(l.name)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-medium active:bg-slate-200"
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">Payment</label>
              <div className="flex gap-2">
                {[
                  { value: 'cash', label: 'Cash' },
                  { value: 'online', label: 'Online' },
                  { value: 'udhaar', label: 'Udhaar' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentMode(opt.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      paymentMode === opt.value
                        ? 'bg-kanakko-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowVoice(true)}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium text-sm flex items-center justify-center gap-2 active:bg-slate-200 transition-colors"
            >
              <Mic size={18} /> Voice
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium text-sm flex items-center justify-center gap-2 active:bg-slate-200 transition-colors"
            >
              <Camera size={18} /> Scan
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0 || saving}
            className={`w-full mt-4 py-4 rounded-2xl font-bold text-lg transition-all ${
              !amount || parseFloat(amount) <= 0 || saving
                ? 'bg-slate-200 text-slate-400'
                : type === 'IN'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]'
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-200 active:scale-[0.98]'
            }`}
          >
            {saving ? 'Saving...' : `Add ${type === 'IN' ? 'Income' : 'Expense'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
