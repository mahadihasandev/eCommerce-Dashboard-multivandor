import React from 'react';
import { useGetSubCategoriesQuery } from '../Slices/apiSlice';
import { Table, Tag, Button } from 'antd';
import { Layers, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ViewSubCategory() {
  const navigate = useNavigate();
  const { data: subCategories = [], isLoading, isFetching } = useGetSubCategoriesQuery();

  const columns = [
    {
      title: 'Subcategory Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center font-bold text-xs">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 text-xs">{name}</span>
        </div>
      ),
    },
    {
      title: 'Parent Category',
      key: 'category',
      render: (_, record) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
          {record.categoryId?.name || 'General Category'}
        </span>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {slug || 'n/a'}
        </span>
      ),
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
              <Layers className="w-6 h-6 text-indigo-600" />
              Subcategories
            </h1>
            <Tag color="purple" className="font-semibold rounded-full">
              {subCategories.length} Subcategories
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Child classifications linked to main categories.
          </p>
        </div>

        <button
          onClick={() => navigate('/addsubcategory')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={subCategories}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewSubCategory;