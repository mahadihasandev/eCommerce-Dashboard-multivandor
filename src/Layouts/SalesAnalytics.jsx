import React, { useState, useMemo } from "react";
import { useGetOrdersQuery, useGetProductsQuery } from "../Slices/apiSlice";
import {
  Calendar,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import { Table, Tag, Select, DatePicker, Button, Card, Progress } from "antd";

function SalesAnalytics() {
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();

  const [timeFilter, setTimeFilter] = useState("month"); // 'today' | 'week' | 'month' | 'year' | 'all'

  // Helper to extract order date
  const getOrderDate = (o) => new Date(o.createdAt || Date.now());

  // Current dates
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Time-filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = getOrderDate(o);
      if (timeFilter === "today") return d >= todayStart;
      if (timeFilter === "week") return d >= weekStart;
      if (timeFilter === "month") return d >= monthStart;
      if (timeFilter === "year") return d >= yearStart;
      return true;
    });
  }, [orders, timeFilter]);

  // Calculations for Today
  const todayOrders = useMemo(() => {
    return orders.filter((o) => getOrderDate(o) >= todayStart);
  }, [orders]);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const todayUnitsSold = todayOrders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return sum + o.items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    }
    return sum + (Number(o.quantity) || 1);
  }, 0);

  // Calculations for This Month
  const monthOrders = useMemo(() => {
    return orders.filter((o) => getOrderDate(o) >= monthStart);
  }, [orders]);

  const monthRevenue = monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const monthUnitsSold = monthOrders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return sum + o.items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    }
    return sum + (Number(o.quantity) || 1);
  }, 0);

  // Filtered period metrics
  const periodRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const periodUnitsSold = filteredOrders.reduce((sum, o) => {
    if (o.items && o.items.length > 0) {
      return sum + o.items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
    }
    return sum + (Number(o.quantity) || 1);
  }, 0);
  const periodAOV = filteredOrders.length > 0 ? Math.round(periodRevenue / filteredOrders.length) : 0;
  const periodDelivered = filteredOrders.filter((o) => o.status === "delivered").length;
  const fulfillmentRate =
    filteredOrders.length > 0 ? Math.round((periodDelivered / filteredOrders.length) * 100) : 0;

  // Product sales velocity calculation
  const productSalesMap = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const isThisMonth = getOrderDate(o) >= monthStart;
      const isToday = getOrderDate(o) >= todayStart;

      if (o.items && o.items.length > 0) {
        o.items.forEach((it) => {
          const name = it.name || "Catalog Product";
          const qty = Number(it.quantity) || 1;
          const rev = (Number(it.price) || 0) * qty;

          if (!map[name]) {
            map[name] = { name, allTimeUnits: 0, monthUnits: 0, todayUnits: 0, revenue: 0 };
          }
          map[name].allTimeUnits += qty;
          map[name].revenue += rev;
          if (isThisMonth) map[name].monthUnits += qty;
          if (isToday) map[name].todayUnits += qty;
        });
      } else if (o.productId) {
        const name = o.productId.name || "Catalog Product";
        const qty = Number(o.quantity) || 1;
        const rev = Number(o.total) || 0;

        if (!map[name]) {
          map[name] = { name, allTimeUnits: 0, monthUnits: 0, todayUnits: 0, revenue: 0 };
        }
        map[name].allTimeUnits += qty;
        map[name].revenue += rev;
        if (isThisMonth) map[name].monthUnits += qty;
        if (isToday) map[name].todayUnits += qty;
      }
    });

    return Object.values(map).sort((a, b) => b.allTimeUnits - a.allTimeUnits);
  }, [orders]);

  // Daily Breakdown Table Data (Last 14 Days)
  const dailyBreakdown = useMemo(() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const dOrders = orders.filter((o) => {
        const od = getOrderDate(o);
        return od >= dayStart && od <= dayEnd;
      });

      const dRevenue = dOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const dUnits = dOrders.reduce((sum, o) => {
        if (o.items && o.items.length > 0) {
          return sum + o.items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        }
        return sum + (Number(o.quantity) || 1);
      }, 0);

      days.push({
        key: dayStart.toISOString(),
        date: dayStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        }),
        isToday: i === 0,
        ordersCount: dOrders.length,
        unitsSold: dUnits,
        revenue: dRevenue,
        deliveredCount: dOrders.filter((o) => o.status === "delivered").length,
      });
    }
    return days;
  }, [orders]);

  // Monthly Breakdown (Current Year)
  const monthlyBreakdown = useMemo(() => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames.map((mName, mIdx) => {
      const mOrders = orders.filter((o) => {
        const od = getOrderDate(o);
        return od.getMonth() === mIdx && od.getFullYear() === now.getFullYear();
      });
      const mRevenue = mOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const mUnits = mOrders.reduce((sum, o) => {
        if (o.items && o.items.length > 0) {
          return sum + o.items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
        }
        return sum + (Number(o.quantity) || 1);
      }, 0);

      return {
        key: mName,
        month: `${mName} ${now.getFullYear()}`,
        isCurrent: mIdx === now.getMonth(),
        ordersCount: mOrders.length,
        unitsSold: mUnits,
        revenue: mRevenue,
      };
    });
  }, [orders]);

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Executive Revenue & Sales Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order & Product Sales Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time daily and monthly breakdown of units sold, revenue generated, and fulfillment rates.
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "Last 7 Days" },
            { id: "month", label: "This Month" },
            { id: "year", label: "This Year" },
            { id: "all", label: "All Time" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setTimeFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeFilter === pill.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Primary Performance KPI Metric Cards (Strict 3-Color: White, Slate, Emerald) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Sales */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today's Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ৳{todayRevenue.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 font-medium">
            <span className="text-slate-500">Units Sold Today:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {todayUnitsSold} units
            </span>
          </div>
        </div>

        {/* This Month's Sales */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              This Month's Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ৳{monthRevenue.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 font-medium">
            <span className="text-slate-500">Units Sold Month:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {monthUnitsSold} units
            </span>
          </div>
        </div>

        {/* Selected Period Orders & Units */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Period Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {filteredOrders.length} <span className="text-sm font-semibold text-slate-400">orders</span>
          </p>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 font-medium">
            <span className="text-slate-500">Total Units:</span>
            <span className="font-bold text-slate-900">{periodUnitsSold} items</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-500 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg Order Value (AOV)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ৳{periodAOV.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 font-medium">
            <span className="text-slate-500">Fulfillment Rate:</span>
            <span className="font-bold text-emerald-700">{fulfillmentRate}%</span>
          </div>
        </div>
      </div>

      {/* Symmetrical 2-Column Section: Daily Breakdown Table on Left, Product Sales Ranking on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Breakdown Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daily Sales Log (Last 14 Days)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact day-by-day calculation of orders placed, units sold, and gross receipts.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
              Live Real-Time Log
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Orders</th>
                  <th className="py-3.5 px-6">Units Sold</th>
                  <th className="py-3.5 px-6">Delivered</th>
                  <th className="py-3.5 px-6 text-right">Day Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyBreakdown.map((row) => (
                  <tr
                    key={row.key}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.isToday ? "bg-emerald-50/30 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2">
                      {row.date}
                      {row.isToday && (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                          TODAY
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {row.ordersCount} orders
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {row.unitsSold} units
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {row.deliveredCount} fulfilled
                    </td>
                    <td className="py-3.5 px-6 text-right font-extrabold text-emerald-700 text-sm">
                      ৳{row.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Velocity Ranking (1 Column) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Top Products by Sales Volume
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by total units sold across customers
            </p>
          </div>

          <div className="space-y-3">
            {productSalesMap.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No product sales recorded yet.
              </p>
            ) : (
              productSalesMap.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Month: <span className="font-semibold text-emerald-700">{item.monthUnits} sold</span> | Today:{" "}
                      <span className="font-semibold">{item.todayUnits}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 block">
                      {item.allTimeUnits} units
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      ৳{item.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Performance Breakdown (Current Year) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Annual Month-by-Month Sales Table ({now.getFullYear()})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative financial trajectory and units processed each calendar month.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Full Year {now.getFullYear()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Month</th>
                <th className="py-3.5 px-6">Orders Count</th>
                <th className="py-3.5 px-6">Total Units Sold</th>
                <th className="py-3.5 px-6 text-right">Gross Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyBreakdown.map((row) => (
                <tr
                  key={row.key}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.isCurrent ? "bg-emerald-50/30 font-semibold" : ""
                  }`}
                >
                  <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2">
                    {row.month}
                    {row.isCurrent && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                        CURRENT MONTH
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">{row.ordersCount} orders</td>
                  <td className="py-3.5 px-6">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {row.unitsSold} units
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-extrabold text-emerald-700 text-sm">
                    ৳{row.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesAnalytics;
