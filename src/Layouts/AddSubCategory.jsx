import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import {
  useAddSubCategoryMutation,
  useGetCategoriesQuery,
} from "../Slices/apiSlice";
import { Layers, Plus, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";

function AddSubCategory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [slug, setSlug] = useState("");
  const [subName, setSubName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const userData = useSelector((state) => state.activeUser?.value);

  const [addSubCategory, { isLoading }] = useAddSubCategoryMutation();
  const { data: categories = [], isLoading: catLoading } = useGetCategoriesQuery();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setSubName(val);
    setSlug(slugify(val, { lower: true }));
  };

  const onFinish = async (values) => {
    if (!categoryId) {
      toast.error("Please select a parent category");
      return;
    }

    try {
      const res = await addSubCategory({
        name: values.subcategory,
        ownerId: userData?.id,
        categoryId: categoryId,
        slug: slug || slugify(values.subcategory, { lower: true }),
      }).unwrap();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Subcategory created successfully!");
      form.resetFields();
      setSlug("");
      setSubName("");
      setTimeout(() => navigate("/viewsubcategory"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create subcategory");
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const selectedCategoryObj = categories.find((c) => c._id === categoryId);

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Add Subcategory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create secondary subcategories attached to a parent category.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewsubcategory")}
          className="rounded-xl text-xs font-semibold"
        >
          View Subcategories
        </Button>
      </div>

      {/* Symmetrical Grid: Form on Left, Live Hierarchy Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Select Parent Category
              </label>
              <Select
                showSearch
                placeholder="Search & choose parent category"
                optionFilterProp="label"
                options={categoryOptions}
                loading={catLoading}
                onChange={(val) => setCategoryId(val)}
                className="w-full h-11 rounded-xl"
              />
            </div>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Subcategory Name</span>}
              name="subcategory"
              rules={[{ required: true, message: "Subcategory name is required" }]}
            >
              <Input
                placeholder="e.g. Wireless Audio"
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
                onClick={() => navigate("/viewsubcategory")}
                className="rounded-xl h-11 px-6 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
              >
                Save Subcategory
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Symmetrical Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Hierarchy Preview
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Visual preview of how the breadcrumbs and dropdown menu will display:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-medium">Navigation Path:</span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 flex-wrap">
                <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                  {selectedCategoryObj?.name || "Parent Category"}
                </span>
                <span className="text-slate-400">/</span>
                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60 font-bold">
                  {subName || "Subcategory"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Organizational Tips
            </h3>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Group similar products under a single subcategory.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Products assigned here will appear on the subcategory shop page.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubCategory;
