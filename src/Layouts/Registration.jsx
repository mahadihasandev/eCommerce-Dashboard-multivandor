import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, Input } from "antd";
import { useRegistrationMutation } from "../Slices/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import { Store, User, Mail, Lock, ArrowRight } from "lucide-react";

function Registration() {
  const navigate = useNavigate();
  const [registration, { isLoading }] = useRegistrationMutation();

  const onFinish = async (values) => {
    try {
      const res = await registration({
        username: values.username,
        email: values.email,
        password: values.password,
      }).unwrap();

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Registration successful! Check your email for OTP verification.");
      setTimeout(() => navigate(`/otp/${values.email}`), 1200);
    } catch (err) {
      toast.error(err?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 font-sans">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-emerald-500/20">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Register Merchant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create an administrator account for your store
          </p>
        </div>

        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-xs font-semibold text-slate-700">Full Name</span>}
            name="username"
            rules={[{ required: true, message: "Please input your full name" }]}
          >
            <Input
              prefix={<User className="w-4 h-4 text-slate-400 mr-2" />}
              placeholder="Merchant Name"
              className="h-11 rounded-xl border-slate-200"
            />
          </Form.Item>

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

          <Form.Item
            label={<span className="text-xs font-semibold text-slate-700">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
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
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Form.Item>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Registration;