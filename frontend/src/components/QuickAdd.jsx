import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Camera } from 'lucide-react';

const NUM_PAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

export default function QuickAdd() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('IN');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleNumPress = (val) => {
    if (val === '⌫') {
      setAmount(prev => prev.slice(0, -1));
    } else if (val === '.' && amount.includes('.')) {
      return;
    } else {
      const newVal = amount + val;
      const num = parseFloat(newVal);
      if (num > 9999999) return;
      setAmount(newVal);
    }
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    navigate('/add', { state: { presetAmount: amount, presetType: type } });
  };

  const displayAmount = amount || '0';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setType('IN')}
            className={`px-5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              type === 'IN'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Got Money
          </button>
          <button
            onClick={() => setType('OUT')}
            className={`px-5 py-1.5 rounded-xl font-bold text-sm transition-all ${
              type === 'OUT'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            Paid Out
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/add', { state: { openScanner: true } })}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 active:bg-slate-200 transition-colors"
          >
            <Camera size={20} />
          </button>
          <button
            onClick={() => navigate('/add', { state: { openVoice: true } })}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 active:bg-slate-200 transition-colors"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className={`text-5xl font-extrabold tracking-tight transition-colors ${
          parseFloat(amount) > 0
            ? type === 'IN' ? 'text-emerald-600' : 'text-rose-600'
            : 'text-slate-300'
        }`}>
          ₹{parseFloat(displayAmount).toLocaleString('en-IN', { minimumFractionDigits: amount.includes('.') ? 2 : 0, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-slate-400 mt-1">{type === 'IN' ? 'Money received' : 'Payment made'}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {NUM_PAD.flat().map((val) => (
          <button
            key={val}
            onClick={() => handleNumPress(val)}
            className="numpad-btn"
          >
            {val}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!amount || parseFloat(amount) <= 0}
        className={`w-full mt-4 py-3.5 rounded-2xl font-bold text-lg transition-all ${
          !amount || parseFloat(amount) <= 0
            ? 'bg-slate-200 text-slate-400'
            : type === 'IN'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]'
              : 'bg-rose-500 text-white shadow-lg shadow-rose-200 active:scale-[0.98]'
        }`}
      >
        Add Entry
      </button>
    </div>
  );
}
