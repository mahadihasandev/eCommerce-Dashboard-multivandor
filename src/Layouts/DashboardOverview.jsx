import React from 'react';
import {
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetCategoriesQuery,
} from '../Slices/apiSlice';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Layers,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DashboardOverview() {
  const navigate = useNavigate();
  const { data: products = [], isLoading: pLoading } = useGetProductsQuery();
  const { data: orders = [], isLoading: oLoading } = useGetOrdersQuery();
  const { data: categories = [], isLoading: cLoading } = useGetCategoriesQuery();

  // Calculate metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const pendingOrders = orders.filter((o) => !o.status || o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const kpis = [
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toLocaleString()}`,
      subtitle: `${orders.length} orders recorded`,
      icon: TrendingUp,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      subtitle: `${pendingOrders} awaiting fulfillment`,
      icon: ShoppingCart,
      color: 'slate',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200/80',
    },
    {
      title: 'Active Products',
      value: products.length,
      subtitle: 'Items listed in catalog',
      icon: Package,
      color: 'slate',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200/80',
    },
    {
      title: 'Categories',
      value: categories.length,
      subtitle: 'Taxonomy classifications',
      icon: Layers,
      color: 'slate',
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200/80',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Store Management Online
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time synchronization with Redux Toolkit and automatic cache invalidation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales & Analytics</span>
          </button>
          <button
            onClick={() => navigate('/addproduct')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => navigate('/vieworder')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Customer Store</span>
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 border ${kpi.border} shadow-xs hover:shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.text} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-1">{kpi.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live orders awaiting processing or shipping</p>
          </div>
          <button
            onClick={() => navigate('/vieworder')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {oLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => {
                  const cust = order.customerName || order.ownerId?.username || 'Guest';
                  const email = order.customerEmail || order.ownerId?.email || '';
                  const status = order.status || 'pending';

                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                      <Clock className="w-3 h-3 text-slate-500" /> Pending
                    </span>
                  );
                  if (status === 'shipped') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200/70 text-slate-800 border border-slate-300">
                        <Truck className="w-3 h-3 text-slate-600" /> Shipped
                      </span>
                    );
                  } else if (status === 'delivered') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
                      </span>
                    );
                  }

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-semibold text-slate-700">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-slate-800">{cust}</p>
                        {email && <p className="text-[11px] text-slate-400">{email}</p>}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-emerald-600">
                        ৳{order.total || 0}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {order.paymentMethod || 'Cash on Delivery'}
                      </td>
                      <td className="py-3.5 px-5">{statusBadge}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => navigate('/vieworder')}
                          className="text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
