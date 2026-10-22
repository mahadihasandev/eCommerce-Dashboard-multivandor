import React from 'react';
import { useGetDiscountsQuery, useDeleteDiscountMutation } from '../Slices/apiSlice';
import { Table, Tag, Modal, Button } from 'antd';
import { Tag as TagIcon, Plus, Trash2, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function ViewDiscount() {
  const navigate = useNavigate();
  const { data: discounts = [], isLoading, isFetching } = useGetDiscountsQuery();
  const [deleteDiscount] = useDeleteDiscountMutation();

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: `Are you sure you want to delete discount code "${name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteDiscount(id).unwrap();
          toast.success('Discount deleted successfully');
        } catch (err) {
          toast.error(err?.data?.error || 'Failed to delete discount');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Coupon Code',
      dataIndex: 'discountname',
      key: 'discountname',
      render: (name) => (
        <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-lg">
          {name}
        </span>
      ),
    },
    {
      title: 'Deduction Value',
      dataIndex: 'discountamoun',
      key: 'discountamoun',
      render: (val, record) => (
        <span className="font-bold text-slate-800 text-xs">
          {record.discounttype === 'parentage' ? `${val}%` : `৳${val}`}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'discounttype',
      key: 'discounttype',
      render: (type) => {
        const isPercent = type === 'parentage';
        return (
          <Tag color={isPercent ? 'geekblue' : 'green'} className="font-semibold uppercase text-[10px] rounded-full">
            {isPercent ? 'Percentage' : type === 'delivery' ? 'Free Shipping' : 'Fixed Amount'}
          </Tag>
        );
      },
    },
    {
      title: 'Condition / Range',
      dataIndex: 'discountrange',
      key: 'discountrange',
      render: (range) => (
        <span className="text-xs text-slate-500">{range || 'Storewide'}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record._id, record.discountname)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Coupon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <TagIcon className="w-6 h-6 text-amber-600" />
              Discounts & Coupons
            </h1>
            <Tag color="gold" className="font-semibold rounded-full">
              {discounts.length} Active Deals
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Storewide promotional codes and percentage markdown rules.
          </p>
        </div>

        <button
          onClick={() => navigate('/adddiscount')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Discount</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={discounts}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewDiscount;