import React, { useState } from "react";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "../Slices/apiSlice";
import { Form, Input, Select, Button, Upload } from "antd";
import {
  PackagePlus,
  CloudUpload,
  Layers,
  DollarSign,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";
import Tiptap from "../Components/Tiptap";

function AddProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();
  const { data: categories = [], isLoading: catLoading } = useGetCategoriesQuery();
  const { data: subCategories = [], isLoading: subCatLoading } = useGetSubCategoriesQuery();

  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedSubCatId, setSelectedSubCatId] = useState("");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setSlug(slugify(val, { lower: true }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.productname);
      formData.append("description", description);
      formData.append("saleprice", values.saleprice);
      formData.append("regularprice", values.regularprice);
      formData.append("stock", values.stock || 10);
      formData.append("slug", slug || slugify(values.productname, { lower: true }));
      formData.append("createdAt", Date.now());
      formData.append("quickoverview", values.quickoverview || "");
      formData.append("categoryId", selectedCatId || "");
      formData.append("subCategoryId", selectedSubCatId || "");

      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append("productImg", file);
        });
      }

      const res = await addProduct(formData).unwrap();
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Product published successfully!");
      form.resetFields();
      setDescription("");
      setSlug("");
      setImages([]);
      setTimeout(() => navigate("/viewproduct"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create product");
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const subCategoryOptions = subCategories.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-emerald-600" />
            Create New Product
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add a new product to your catalog with rich description, images, and taxonomy tags.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewproduct")}
          className="rounded-xl text-xs font-semibold"
        >
          View All Products
        </Button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-6"
        >
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Product Name</span>}
                name="productname"
                rules={[{ required: true, message: "Product name is required" }]}
              >
                <Input
                  placeholder="e.g. Wireless Ergonomic Headphones"
                  onChange={handleNameChange}
                  className="rounded-xl h-11"
                />
              </Form.Item>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Generated Slug
                </label>
                <Input
                  value={slug}
                  disabled
                  placeholder="auto-generated-slug"
                  className="rounded-xl h-11 bg-slate-50 text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Category
                </label>
                <Select
                  showSearch
                  placeholder="Select Category"
                  optionFilterProp="label"
                  options={categoryOptions}
                  loading={catLoading}
                  onChange={(val) => setSelectedCatId(val)}
                  className="w-full h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Subcategory
                </label>
                <Select
                  showSearch
                  placeholder="Select Subcategory"
                  optionFilterProp="label"
                  options={subCategoryOptions}
                  loading={subCatLoading}
                  onChange={(val) => setSelectedSubCatId(val)}
                  className="w-full h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Regular Price (৳)</span>}
                name="regularprice"
                rules={[{ required: true, message: "Regular price is required" }]}
              >
                <Input type="number" placeholder="1200" className="rounded-xl h-11" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Sale Price (৳)</span>}
                name="saleprice"
                rules={[{ required: true, message: "Sale price is required" }]}
              >
                <Input type="number" placeholder="950" className="rounded-xl h-11" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Stock Units</span>}
                name="stock"
                rules={[{ required: true, message: "Stock is required" }]}
              >
                <Input type="number" placeholder="50" className="rounded-xl h-11" />
              </Form.Item>
            </div>
          </div>

          {/* Section 3: Media & Descriptions */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <CloudUpload className="w-4 h-4 text-emerald-600" />
              Product Media & Description
            </h2>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Product Images</span>}
              name="image"
              rules={[{ required: true, message: "Please upload at least one product image" }]}
            >
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
                <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">
                  Click or drag files to upload product photos
                </p>
                <p className="text-[11px] text-slate-400 mb-3">PNG, JPG, WEBP accepted</p>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {images.length > 0 && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2">
                    ✓ {images.length} file(s) selected
                  </p>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Quick Overview</span>}
              name="quickoverview"
            >
              <Input.TextArea
                rows={2}
                placeholder="Brief bullet points or one-sentence product highlight..."
                className="rounded-xl"
              />
            </Form.Item>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Detailed Description (Rich Text Editor)
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <Tiptap value={description} onChange={setDescription} />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              onClick={() => navigate("/viewproduct")}
              className="rounded-xl h-11 px-6 font-semibold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
            >
              Publish Product
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddProduct;
