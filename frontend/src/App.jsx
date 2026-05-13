import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LedgerList from './pages/LedgerList';
import LedgerDetail from './pages/LedgerDetail';
import AddEntry from './pages/AddEntry';
import Analytics from './pages/Analytics';
import BottomNav from './components/BottomNav';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-kanakko-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children }) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-20">
      <div className="px-4 pt-4 pb-4">{children}</div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-kanakko-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/ledger" element={<ProtectedRoute><AppLayout><LedgerList /></AppLayout></ProtectedRoute>} />
      <Route path="/ledger/:id" element={<ProtectedRoute><AppLayout><LedgerDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddEntry /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}
