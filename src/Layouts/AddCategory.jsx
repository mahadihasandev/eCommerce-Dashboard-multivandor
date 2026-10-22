import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useAddCategoryMutation } from "../Slices/apiSlice";
import { FolderPlus, Tag, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";

function AddCategory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [slug, setSlug] = useState("");
  const [catName, setCatName] = useState("");
  const userData = useSelector((state) => state.activeUser?.value);
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCatName(val);
    setSlug(slugify(val, { lower: true }));
  };

  const onFinish = async (values) => {
    try {
      const res = await addCategory({
        name: values.category,
        ownerId: userData?.id,
        slug: slug || slugify(values.category, { lower: true }),
      }).unwrap();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Category created successfully!");
      form.resetFields();
      setSlug("");
      setCatName("");
      setTimeout(() => navigate("/viewcategory"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create category");
    }
  };

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-emerald-600" />
            Add New Category
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create high-level taxonomy categories for product catalog organization.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewcategory")}
          className="rounded-xl text-xs font-semibold"
        >
          View Categories
        </Button>
      </div>

      {/* Symmetrical Grid Layout: Form on Left, Live Preview & Tips on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="space-y-4"
          >
            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Category Name</span>}
              name="category"
              rules={[{ required: true, message: "Please input the category name" }]}
            >
              <Input
                placeholder="e.g. Consumer Electronics"
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

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                onClick={() => navigate("/viewcategory")}
                className="rounded-xl h-11 px-6 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
              >
                Save Category
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Symmetrical Card: Live Preview & Best Practices */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Storefront Preview
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Here is how your new category tag will appear in the customer navigation ribbon:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center">
              <span className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-white border border-emerald-200/80 shadow-xs">
                {catName || "Sample Category"}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Taxonomy Guidelines
            </h3>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Keep category names concise (1-3 words).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Slug is auto-formatted for search engine friendly URLs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Subcategories can be attached after creating this category.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;