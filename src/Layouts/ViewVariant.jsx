import React from 'react';
import { useGetVariantsQuery } from '../Slices/apiSlice';
import { Table, Tag, Button } from 'antd';
import { Sliders, Plus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ViewVariant() {
  const navigate = useNavigate();
  const { data: rawVariants = [], isLoading, isFetching } = useGetVariantsQuery();

  const columns = [
    {
      title: 'Variant',
      key: 'variant',
      render: (_, record) => {
        const text = record.image;
        const imgUrl = text
          ? text.startsWith('http')
            ? text
            : `${import.meta.env.VITE_LOCAL_API || 'https://e-commerce-backend-multivandor.vercel.app'}${text.startsWith('/') ? '' : '/'}${text}`
          : null;

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
              {imgUrl ? (
                <img src={imgUrl} alt={record.variantname} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-xs">{record.variantname || record.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {record.slug || 'standard-variant'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Regular Price',
      dataIndex: 'regularprice',
      key: 'regularprice',
      render: (val) => <span className="font-semibold text-slate-600 text-xs">৳{val || 0}</span>,
    },
    {
      title: 'Sale Price',
      dataIndex: 'saleprice',
      key: 'saleprice',
      render: (val) => <span className="font-bold text-emerald-600 text-xs">৳{val || 0}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          ● Active
        </span>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Sliders className="w-6 h-6 text-violet-600" />
              Product Variants
            </h1>
            <Tag color="purple" className="font-semibold rounded-full">
              {rawVariants.length} Variants
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sizes, colors, and configuration options attached to catalog products.
          </p>
        </div>

        <button
          onClick={() => navigate('/addvariant')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variant</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={rawVariants}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewVariant;