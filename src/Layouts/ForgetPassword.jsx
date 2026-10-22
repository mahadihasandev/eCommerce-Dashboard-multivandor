import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, Input } from "antd";
import { useForgetPasswordMutation } from "../Slices/apiSlice";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";

function ForgetPassword() {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onFinish = async (values) => {
    try {
      const res = await forgetPassword({ email: values.email }).unwrap();
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Password recovery instructions sent to your email!");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to process recovery request");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide your merchant email to receive password reset instructions
          </p>
        </div>

        <Form
          name="forgot_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-700">Email Address</span>}
            name="email"
            rules={[{ required: true, message: "Please input your email address" }]}
          >
            <Input
              prefix={<Mail className="w-4 h-4 text-slate-400 mr-2" />}
              placeholder="admin@example.com"
              className="h-11 rounded-xl border-slate-200"
            />
          </Form.Item>

          <Form.Item className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Form.Item>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <Link
              to="/login"
              className="font-semibold text-slate-600 hover:text-emerald-600 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ForgetPassword;