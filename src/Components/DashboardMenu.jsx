import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  FolderTree,
  Sliders,
  Image as ImageIcon,
  Tag,
  PlusCircle,
  BarChart3,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { authInfo } from '../Slices/AuthSlices';

function DashboardMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.activeUser?.value);

  const handleLogout = () => {
    localStorage.removeItem('userinfo');
    dispatch(authInfo(null));
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'Intelligence & Overview',
      items: [
        {
          label: 'Dashboard Home',
          path: '/',
          icon: LayoutDashboard,
        },
        {
          label: 'Sales & Analytics',
          path: '/analytics',
          icon: BarChart3,
        },
      ],
    },
    {
      group: 'Orders Management',
      items: [
        {
          label: 'Customer Orders',
          path: '/vieworder',
          icon: ShoppingCart,
        },
      ],
    },
    {
      group: 'Catalog & Products',
      items: [
        {
          label: 'All Products',
          path: '/viewproduct',
          icon: Package,
        },
        {
          label: 'Add Product',
          path: '/addproduct',
          icon: PlusCircle,
        },
        {
          label: 'Product Variants',
          path: '/viewvariant',
          icon: Sliders,
        },
        {
          label: 'Add Variant',
          path: '/addvariant',
          icon: PlusCircle,
        },
      ],
    },
    {
      group: 'Taxonomy',
      items: [
        {
          label: 'Categories',
          path: '/viewcategory',
          icon: FolderTree,
        },
        {
          label: 'Add Category',
          path: '/addcategory',
          icon: PlusCircle,
        },
        {
          label: 'Subcategories',
          path: '/viewsubcategory',
          icon: Layers,
        },
        {
          label: 'Add Subcategory',
          path: '/addsubcategory',
          icon: PlusCircle,
        },
      ],
    },
    {
      group: 'Marketing & Promotions',
      items: [
        {
          label: 'Banners',
          path: '/viewbanner',
          icon: ImageIcon,
        },
        {
          label: 'Add Banner',
          path: '/addbannar',
          icon: PlusCircle,
        },
        {
          label: 'Discounts & Coupons',
          path: '/viewdiscount',
          icon: Tag,
        },
        {
          label: 'Add Discount',
          path: '/adddiscount',
          icon: PlusCircle,
        },
      ],
    },
  ];

  return (
    <aside className="w-68 min-h-[calc(100vh-4.5rem)] bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 sm:p-5 select-none shrink-0">
      <div className="space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.toLowerCase() === item.path.toLowerCase();

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/80 font-black'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-emerald-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Card at bottom of sidebar */}
      <div className="pt-4 mt-6 border-t border-slate-200/80">
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-sm font-black text-slate-900 truncate">
              {user?.username || 'Merchant User'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DashboardMenu;