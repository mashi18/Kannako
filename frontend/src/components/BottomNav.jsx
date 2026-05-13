import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookUser, PlusCircle, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/ledger', icon: BookUser, label: 'Khata' },
  { path: '/add', icon: PlusCircle, label: 'Add', center: true },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-100 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          if (item.center) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -top-4 bg-kanakko-600 text-white p-4 rounded-full shadow-lg shadow-kanakko-300 active:scale-90 transition-transform duration-150"
                aria-label="Add entry"
              >
                <Icon size={28} strokeWidth={2.5} />
              </button>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 ${
                isActive ? 'text-kanakko-700' : 'text-slate-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-xs font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
