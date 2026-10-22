import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useAddVariantMutation } from "../Slices/apiSlice";
import { Sliders, CloudUpload, Sparkles, CheckCircle2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";
import Tiptap from "../Components/Tiptap";

function Addvariant() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [slug, setSlug] = useState("");
  const [varName, setVarName] = useState("");
  const [regPrice, setRegPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [addVariant, { isLoading }] = useAddVariantMutation();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setVarName(val);
    setSlug(slugify(val, { lower: true }));
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("variantname", values.variantname);
      formData.append("description", description);
      if (image) formData.append("productImg", image);
      formData.append("saleprice", values.saleprice);
      formData.append("regularprice", values.regularprice);
      formData.append("slug", slug || slugify(values.variantname, { lower: true }));

      const res = await addVariant(formData).unwrap();
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Variant created successfully!");
      form.resetFields();
      setDescription("");
      setSlug("");
      setVarName("");
      setRegPrice("");
      setSalePrice("");
      setImage(null);
      setTimeout(() => navigate("/viewvariant"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create variant");
    }
  };

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-violet-600" />
            Add Product Variant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify SKU pricing and details for alternate product editions.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewvariant")}
          className="rounded-xl text-xs font-semibold"
        >
          View Variants
        </Button>
      </div>

      {/* Symmetrical Grid: Form on Left, Live Variant Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Variant Name</span>}
                name="variantname"
                rules={[{ required: true, message: "Variant name is required" }]}
              >
                <Input
                  placeholder="e.g. Midnight Black / 256GB"
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
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Regular Price (৳)</span>}
                name="regularprice"
                rules={[{ required: true, message: "Regular price is required" }]}
              >
                <Input
                  type="number"
                  placeholder="1500"
                  onChange={(e) => setRegPrice(e.target.value)}
                  className="rounded-xl h-11"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Sale Price (৳)</span>}
                name="saleprice"
                rules={[{ required: true, message: "Sale price is required" }]}
              >
                <Input
                  type="number"
                  placeholder="1250"
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="rounded-xl h-11"
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Variant Image</span>}
              name="image"
            >
              <div className="border-2 border-dashed border-slate-200 hover:border-violet-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50">
                <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">
                  Upload image for this specific variant
                </p>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                />
                {image && (
                  <p className="text-xs font-semibold text-violet-600 mt-2">
                    ✓ {image.name} selected
                  </p>
                )}
              </div>
            </Form.Item>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Variant Description
              </label>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <Tiptap value={description} onChange={setDescription} />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                onClick={() => navigate("/viewvariant")}
                className="rounded-xl h-11 px-6 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="bg-violet-600 hover:bg-violet-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
              >
                Save Variant
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Symmetrical Card: Live SKU Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              SKU Badge Preview
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              How this variant edition appears to buyers selecting specifications:
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <p className="font-bold text-slate-800 text-sm">
                {varName || "Variant Title"}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-600 text-sm">
                  ৳{salePrice || regPrice || 0}
                </span>
                {salePrice && regPrice && salePrice !== regPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳{regPrice}
                  </span>
                )}
              </div>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60">
                Custom Edition SKU
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Pricing Recommendation
            </h3>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Set sale price equal to or below regular price.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Images should be distinct to represent this SKU visually.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addvariant;
