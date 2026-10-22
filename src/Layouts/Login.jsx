import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Checkbox, Form, Input } from "antd";
import { useLoginMutation } from "../Slices/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authInfo } from "../Slices/AuthSlices";
import { Store, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const user = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (user.error) {
        toast.error(user.error);
        return;
      }

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      if (user.role === "user") {
        toast.error(
          "Customer accounts cannot access the merchant dashboard. Please use a merchant or admin account."
        );
        return;
      }

      dispatch(authInfo(user));
      localStorage.setItem("userinfo", JSON.stringify(user));
      toast.success("Welcome back! Login successful.");
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      toast.error(err?.data?.error || "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 font-sans">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-emerald-500/20">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Merchant Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your NexStore store management dashboard
          </p>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
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

          <Form.Item
            label={<span className="text-xs font-semibold text-slate-700">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-slate-400 mr-2" />}
              placeholder="••••••••"
              className="h-11 rounded-xl border-slate-200"
            />
          </Form.Item>

          <div className="flex items-center justify-between text-xs">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-600">Remember credentials</Checkbox>
            </Form.Item>
            <Link
              to="/forgetpassword"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Form.Item>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don't have a merchant account? </span>
            <Link
              to="/registration"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Register here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;