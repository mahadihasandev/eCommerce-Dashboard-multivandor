import React from 'react';
import { useGetBannersQuery, useDeleteBannerMutation } from '../Slices/apiSlice';
import { Table, Modal, Button, Tag, Space } from 'antd';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function ViewBanner() {
  const navigate = useNavigate();
  const { data: banners = [], isLoading, isFetching } = useGetBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();

  const handleDelete = (id, title) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: `Are you sure you want to remove banner "${title || 'Promo'}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBanner(id).unwrap();
          toast.success('Banner deleted successfully');
        } catch (err) {
          toast.error(err?.data?.error || 'Failed to delete banner');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Banner Preview',
      key: 'image',
      render: (_, record) => {
        const text = record.image;
        const imgUrl = text
          ? text.startsWith('http')
            ? text
            : `${import.meta.env.VITE_LOCAL_API || 'http://localhost:8000'}${text.startsWith('/') ? '' : '/'}${text}`
          : null;

        return (
          <div className="w-28 h-14 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
            {imgUrl ? (
              <img src={imgUrl} alt={record.name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
        );
      },
    },
    {
      title: 'Banner Title',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="font-bold text-slate-800 text-xs">{name}</span>,
    },
    {
      title: 'Target Product',
      dataIndex: 'productSlug',
      key: 'productSlug',
      render: (slug) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          {slug || 'Storefront Link'}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc) => (
        <span className="text-xs text-slate-500 truncate max-w-xs block">
          {desc || 'Promotional display headline'}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record._id, record.name)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Banner"
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
              <ImageIcon className="w-6 h-6 text-rose-600" />
              Promotional Banners
            </h1>
            <Tag color="magenta" className="font-semibold rounded-full">
              {banners.length} Active Banners
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Featured promotional heroes displayed across the storefront.
          </p>
        </div>

        <button
          onClick={() => navigate('/addbannar')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={banners}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>
    </div>
  );
}

export default ViewBanner;