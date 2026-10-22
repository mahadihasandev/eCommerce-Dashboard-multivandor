import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authInfo } from '../Slices/AuthSlices';
import { Store, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

function Navbar() {
  const user = useSelector((state) => state.activeUser?.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userinfo');
    dispatch(authInfo(null));
    navigate('/login');
  };

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 sm:px-10 flex items-center justify-between shadow-xs">
      {/* Brand & Store Link */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
              NexStore
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                MERCHANT
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold">Store Management & Analytics</p>
          </div>
        </div>

        <a
          href={import.meta.env.VITE_STOREFRONT_URL || "https://next-frontend-express-project-saii.vercel.app"}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 px-4 py-2 rounded-xl transition-all shadow-xs"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* User Actions with Larger Typography */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm uppercase">
                {user.username ? user.username.charAt(0) : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-none">
                  {user.username || 'Merchant'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{user.role || 'Admin'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200/80 rounded-2xl transition-all shadow-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 px-4 py-2"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
