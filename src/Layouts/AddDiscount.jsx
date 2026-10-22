import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { useAddDiscountMutation } from "../Slices/apiSlice";
import { Tag as TagIcon, Plus, Sparkles, Percent, Ticket, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function AddDiscount() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState("fixed");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [addDiscount, { isLoading }] = useAddDiscountMutation();

  const onFinish = async (values) => {
    try {
      const res = await addDiscount({
        discountname: values.discountname,
        discountamoun: Number(values.discountamount),
        discounttype: discountType,
        discountrange: values.discountrange || "All",
      }).unwrap();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Discount code published successfully!");
      form.resetFields();
      setDiscountCode("");
      setDiscountAmount("");
      setTimeout(() => navigate("/viewdiscount"), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to create discount");
    }
  };

  return (
    <div className="w-full space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <TagIcon className="w-6 h-6 text-amber-600" />
            Create Coupon / Discount
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish markdown codes for marketing campaigns and storefront deals.
          </p>
        </div>
        <Button
          onClick={() => navigate("/viewdiscount")}
          className="rounded-xl text-xs font-semibold"
        >
          View Discounts
        </Button>
      </div>

      {/* Symmetrical Grid: Form on Left, Live Coupon Card on Right */}
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
              label={<span className="text-xs font-semibold text-slate-700">Coupon Code / Name</span>}
              name="discountname"
              rules={[{ required: true, message: "Coupon code is required" }]}
            >
              <Input
                placeholder="e.g. FLASH25"
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="rounded-xl h-11 uppercase font-mono"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-700">Deduction Value</span>}
                name="discountamount"
                rules={[{ required: true, message: "Deduction amount is required" }]}
              >
                <Input
                  type="number"
                  placeholder="e.g. 25"
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="rounded-xl h-11"
                />
              </Form.Item>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Discount Type
                </label>
                <Select
                  value={discountType}
                  onChange={(val) => setDiscountType(val)}
                  className="w-full h-11 rounded-xl"
                  options={[
                    { value: "fixed", label: "Fixed Amount (৳)" },
                    { value: "parentage", label: "Percentage (%)" },
                    { value: "delivery", label: "Free Shipping" },
                  ]}
                />
              </div>
            </div>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-700">Eligibility / Range</span>}
              name="discountrange"
            >
              <Input
                placeholder="e.g. Orders over ৳1000, or All"
                className="rounded-xl h-11"
              />
            </Form.Item>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                onClick={() => navigate("/viewdiscount")}
                className="rounded-xl h-11 px-6 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="bg-amber-600 hover:bg-amber-700 rounded-xl h-11 px-8 font-semibold text-xs shadow-xs"
              >
                Save Discount
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Symmetrical Card: Live Voucher Ticket */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-600" />
              Live Coupon Card
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Preview of customer checkout discount voucher:
            </p>

            <div className="border-2 border-dashed border-amber-300 bg-amber-50/60 rounded-2xl p-5 text-center relative overflow-hidden">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                Store Promo Code
              </p>
              <p className="text-xl font-extrabold text-slate-800 font-mono tracking-wider">
                {discountCode || "VOUCHERCODE"}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white font-bold text-xs rounded-full shadow-xs">
                {discountType === "parentage"
                  ? `${discountAmount || "0"}% OFF`
                  : discountType === "delivery"
                  ? "FREE SHIPPING"
                  : `৳${discountAmount || "0"} OFF`}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Discount Rules
            </h3>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Customers can apply this voucher at cart checkout.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Codes are case-insensitive and auto-capitalized.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDiscount;