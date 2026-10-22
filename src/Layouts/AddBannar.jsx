import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { useAddBannerMutation, useGetProductsQuery } from "../Slices/apiSlice";
import { Image as ImageIcon, CloudUpload, Sparkles, CheckCircle2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function AddBannar() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [productSlug, setProductSlug] = useState("");

  const [addBanner, { isLoading }] = useAddBannerMutation();
  const { data: products = [], isLoading: pLoading } = useGetProductsQuery();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.productname);
      formData.append("description", values.description || "");
      if (image) formData.append("productImg", image);
      formData.append("productSlug", productSlug || values.productname);

      const res = await addBanner(formData).unwrap();
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Banner published successfully!");
      form.resetFields();
      setImage(null);
      setImagePreview(null);
      setBannerTitle("");
      setTimeout(() => navigate("/viewbanner"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create banner");
    }
  };

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.name,
    slug: p.slug || p._id,
  }));

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-rose-600" />
            Create Promotional Banner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display large banner campaigns linked to active product landing pages.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewbanner")}
          className="rounded-xl text-xs font-semibold"
        >
          View Banners
        </Button>
      </div>

      {/* Symmetrical Grid: Form on Left, Live Banner Mockup on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="space-y-4"
          >
            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Banner Headline / Name</span>}
              name="productname"
              rules={[{ required: true, message: "Banner title is required" }]}
            >
              <Input
                placeholder="e.g. Summer Flash Sale - Up to 40% Off"
                onChange={(e) => setBannerTitle(e.target.value)}
                className="rounded-xl h-11"
              />
            </Form.Item>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Link To Product (Optional)
              </label>
              <Select
                showSearch
                placeholder="Select target product"
                optionFilterProp="label"
                options={productOptions}
                loading={pLoading}
                onChange={(val, opt) => setProductSlug(opt?.slug || val)}
                className="w-full h-11 rounded-xl"
              />
            </div>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Banner Sub-Description</span>}
              name="description"
            >
              <Input.TextArea
                rows={3}
                placeholder="Short supporting description or call to action..."
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Banner Image File</span>}
              name="image"
              rules={[{ required: true, message: "Please upload a banner image" }]}
            >
              <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
                <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">
                  Upload wide promotional banner image
                </p>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                />
              </div>
            </Form.Item>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                onClick={() => navigate("/viewbanner")}
                className="rounded-xl h-11 px-6 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="bg-rose-600 hover:bg-rose-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
              >
                Publish Banner
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Symmetrical Card: Live Banner Mockup */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-600" />
              Storefront Hero Preview
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Preview of how the carousel slide appears on the customer home page:
            </p>

            <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden relative flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">Upload an image to see live preview</span>
                </div>
              )}
              {bannerTitle && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <p className="font-bold text-xs truncate">{bannerTitle}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Display Specs
            </h3>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>Recommended resolution: 1300 × 360 px.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>Keep key text centered for mobile screens.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBannar;
