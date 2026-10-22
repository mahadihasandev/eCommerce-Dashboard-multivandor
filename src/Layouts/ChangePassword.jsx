import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, Input } from "antd";
import { useChangePasswordMutation } from "../Slices/apiSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";

function ChangePassword() {
  const params = useParams();
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onFinish = async (values) => {
    try {
      const res = await changePassword({
        email: params.email,
        newpassword: values.password,
      }).unwrap();

      if (res?.success) {
        toast.success("Password updated successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(res?.error || "Failed to update password");
      }
    } catch (err) {
      toast.error(err?.data?.error || "Error updating password");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 font-sans">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create a secure password for account:{" "}
            <span className="font-semibold text-slate-800">{params.email}</span>
          </p>
        </div>

        <Form
          name="change_password_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-700">New Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please input your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-slate-400 mr-2" />}
              placeholder="••••••••"
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
              <span>Update Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Form.Item>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassword;