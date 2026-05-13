import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

export default function Register() {
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!name.trim()) { setLocalError('Name is required'); return; }
    if (phone.length < 10) { setLocalError('Enter a valid 10-digit phone number'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try { await register(name, phone, password, shopName); }
    catch (err) { setLocalError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-kanakko-600 to-kanakko-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-3xl mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Kanakko</h1>
          <p className="text-kanakko-200 mt-1">Start your digital khata</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-3">
          <h2 className="text-xl font-bold text-slate-800 text-center">Create Account</h2>

          {(error || localError) && (
            <p className="text-sm text-rose-500 bg-rose-50 p-2.5 rounded-xl">{localError || error}</p>
          )}

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Rajesh Kumar" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Phone Number</label>
            <input type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="input-field" placeholder="9876543210" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Shop Name <span className="text-slate-400">(optional)</span></label>
            <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="input-field" placeholder="Rajesh General Store" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="At least 6 characters" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-kanakko-600 font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
