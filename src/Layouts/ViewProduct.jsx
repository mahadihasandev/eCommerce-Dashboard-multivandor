import React, { useState } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useEditProductMutation,
} from "../Slices/apiSlice";
import { Table, Space, Modal, Input, Button, Tag } from "antd";
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Search,
  ExternalLink,
  DollarSign,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";

function ViewProduct() {
  const navigate = useNavigate();
  const { data: rawProducts = [], isLoading, isFetching } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRegularPrice, setEditRegularPrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");

  const handleEditClick = (item) => {
    setCurrentId(item._id || item.id);
    setEditName(item.name || "");
    setEditDescription(item.description || "");
    setEditRegularPrice(item.regularprice || item.regular || "");
    setEditSalePrice(item.saleprice || "");
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName) {
      toast.error("Product name cannot be empty");
      return;
    }
    try {
      await editProduct({
        id: currentId,
        name: editName,
        description: editDescription,
        regularprice: editRegularPrice,
        saleprice: editSalePrice,
        slug: slugify(editName, { lower: true }),
      }).unwrap();
      toast.success("Product updated successfully!");
      setEditModalVisible(false);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to update product");
    }
  };

  const handleDeleteConfirm = (id, name) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProduct(id).unwrap();
          toast.success("Product deleted successfully");
        } catch (err) {
          toast.error(err?.data?.error || "Failed to delete product");
        }
      },
    });
  };

  // Filter products by search
  const filteredProducts = rawProducts.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => {
        const raw = Array.isArray(record.image) ? record.image[0] : record.image;
        const imgUrl = raw
          ? raw.startsWith("http")
            ? raw
            : `${import.meta.env.VITE_LOCAL_API || "https://e-commerce-backend-multivandor.vercel.app"}${raw.startsWith("/") ? "" : "/"}${raw}`
          : null;

        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={record.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-xs truncate max-w-xs">
                {record.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                {String(record.description || "").replace(/<[^>]+>/g, " ")}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Pricing",
      key: "price",
      render: (_, record) => {
        const reg = record.regularprice || record.regular;
        const sale = record.saleprice;
        return (
          <div className="flex flex-col text-xs">
            <span className="font-bold text-emerald-600">৳{sale || reg || 0}</span>
            {sale && reg && sale !== reg && (
              <span className="text-[10px] text-slate-400 line-through">৳{reg}</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Inventory",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        const count = Number(stock || 0);
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              count > 10
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : count > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                : "bg-red-50 text-red-700 border border-red-200/60"
            }`}
          >
            {count > 0 ? `${count} in stock` : "Out of stock"}
          </span>
        );
      },
    },
    {
      title: "Category",
      key: "category",
      render: (_, record) => (
        <span className="text-xs text-slate-600">
          {record.categoryId?.name || "General"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <button
            onClick={() => handleEditClick(record)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteConfirm(record._id, record.name)}
            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Product Catalog
            </h1>
            <Tag color="cyan" className="font-semibold rounded-full">
              {filteredProducts.length} Products
            </Tag>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time catalog state synced with Redux Toolkit and automatic cache invalidation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all w-60"
            />
          </div>

          <button
            onClick={() => navigate("/addproduct")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey={(r) => r._id || r.id}
          loading={isLoading || isFetching}
          pagination={{ pageSize: 8 }}
          className="clean-table"
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">Edit Product Details</span>
          </div>
        }
        open={editModalVisible}
        onOk={handleSaveEdit}
        confirmLoading={isUpdating}
        onCancel={() => setEditModalVisible(false)}
        okText="Save Changes"
        okButtonProps={{ className: "bg-emerald-600 hover:bg-emerald-700" }}
      >
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Product Title
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Product title"
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Description
            </label>
            <Input.TextArea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              placeholder="Product description"
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Regular Price (৳)
              </label>
              <Input
                value={editRegularPrice}
                onChange={(e) => setEditRegularPrice(e.target.value)}
                placeholder="Regular price"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Sale Price (৳)
              </label>
              <Input
                value={editSalePrice}
                onChange={(e) => setEditSalePrice(e.target.value)}
                placeholder="Sale price"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewProduct;
