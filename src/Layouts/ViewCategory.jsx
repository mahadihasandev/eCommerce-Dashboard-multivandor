import React from 'react';
import { useGetCategoriesQuery } from '../Slices/apiSlice';
import { Table, Space, Tag, Button } from 'antd';
import { FolderTree, Plus, Layers, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ViewCategory() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.activeUser?.value);
  const { data: categories = [], isLoading, isFetching } = useGetCategoriesQuery();

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center font-bold text-xs">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 text-xs">{name}</span>
        </div>
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
      title: 'Authorized Role',
      key: 'role',
      render: () => (
        <Tag color="cyan" className="font-semibold uppercase text-[10px] rounded-full">
          {userData?.role || 'Admin'}
        </Tag>
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
              <FolderTree className="w-6 h-6 text-emerald-600" />
              Categories
            </h1>
            <Tag color="cyan" className="font-semibold rounded-full">
              {categories.length} Categories
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Top-level taxonomy categories synced via RTK Query cache.
          </p>
        </div>

        <button
          onClick={() => navigate('/addcategory')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewCategory;