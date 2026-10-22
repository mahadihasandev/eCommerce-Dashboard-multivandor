import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../Slices/apiSlice";
import { Table, Tag, Select, Card, Modal, Input } from "antd";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function ViewOrder() {
  const { data: orders = [], isLoading, isFetching, refetch } = useGetOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [viewModalOrder, setViewModalOrder] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.error || "Error updating order status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-900 border border-slate-300">
            <Truck className="w-3.5 h-3.5 text-slate-700" /> Shipped
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80">
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" /> Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 line-through border border-slate-200/60">
            <XCircle className="w-3.5 h-3.5 text-slate-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Pending
          </span>
        );
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const custName = (o.customerName || o.ownerId?.username || "").toLowerCase();
    const custEmail = (o.customerEmail || o.ownerId?.email || "").toLowerCase();
    const id = (o._id || "").toLowerCase();
    const matchesSearch =
      custName.includes(searchTerm.toLowerCase()) ||
      custEmail.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "all" ||
      (o.status || "pending") === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/60">
          #{id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Customer & Destination",
      key: "customer",
      render: (_, record) => {
        const name = record.customerName || record.ownerId?.username || "Guest Customer";
        const email = record.customerEmail || record.ownerId?.email || "";
        const phone = record.phone || "";
        const address = record.address || "";

        return (
          <div className="flex flex-col text-xs">
            <span className="font-bold text-slate-800">{name}</span>
            {email && <span className="text-slate-400 text-[11px]">{email}</span>}
            {phone && <span className="text-slate-500 font-mono text-[11px]">{phone}</span>}
            {address && (
              <span className="text-slate-500 text-[11px] truncate max-w-xs mt-0.5">
                📍 {address}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Items Ordered",
      key: "items",
      render: (_, record) => {
        if (record.items && record.items.length > 0) {
          return (
            <div className="space-y-1">
              {record.items.map((it, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="font-semibold">{it.name || "Product"}</span>
                  <span className="text-slate-400">× {it.quantity || 1}</span>
                  <span className="text-slate-500 font-medium">(৳{it.price || 0})</span>
                </div>
              ))}
            </div>
          );
        }

        if (record.productId) {
          const p = record.productId;
          return (
            <div className="text-xs text-slate-700">
              <span className="font-semibold">{p.name || "Product"}</span>
              <span className="text-slate-400 ml-1">× {record.quantity || 1}</span>
            </div>
          );
        }

        return <span className="text-xs text-slate-400">Custom Order</span>;
      },
    },
    {
      title: "Order Total",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <span className="font-bold text-emerald-600 text-sm">
          ৳{(total || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200/60">
          {method || "Cash on Delivery"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Change Status",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue={record.status || "pending"}
          size="small"
          className="w-32 rounded-lg"
          onChange={(newVal) => handleStatusChange(record._id, newVal)}
          options={[
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
              Customer Orders
            </h1>
            <Tag color="cyan" className="font-semibold rounded-full">
              {filteredOrders.length} Orders
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment tracking powered by RTK Query with instant updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all w-64"
            />
          </div>

          <Select
            value={selectedStatusFilter}
            onChange={(val) => setSelectedStatusFilter(val)}
            className="w-36 h-9"
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />

          <button
            onClick={() => refetch()}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewOrder;
