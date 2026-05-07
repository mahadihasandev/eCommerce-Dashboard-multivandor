import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Registration() {
  const apiBaseUrl = import.meta.env.VITE_LOCAL_API;
  const registrationAuthHeader = import.meta.env.VITE_REGISTRATION_AUTH_HEADER;

  const onFinish = async (values) => {
    if (!apiBaseUrl) {
      toast.error("API URL is missing. Set VITE_LOCAL_API in .env");
      return;
    }
    if (!registrationAuthHeader) {
      toast.error("Registration auth header is missing. Set VITE_REGISTRATION_AUTH_HEADER in .env");
      return;
    }

    try {
      let data = await axios.post(
        `${apiBaseUrl}/api/v1/auth/registration`,
        {
          username: values.username,
          email: values.email,
          password: values.password,
        },
        {
          headers: { auth: registrationAuthHeader },
        }
      );

      const isSuccessStatus = data?.status >= 200 && data?.status < 300;

      if (!isSuccessStatus) {
        toast.error("Registration failed");
      } else if (data?.data?.error) {
        toast.error(data.data.error);
      } else {
        toast.success("Registration done. Verify your email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Registration failed");
    }
  };

  const onFinishFailed = () => {
    toast.error("Please fill in required fields");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      {/* Modern Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            Fill in your details to get started
          </p>
        </div>

        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-slate-200 font-medium">Username</span>}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              placeholder="johndoe"
              className="h-12 rounded-lg border-slate-600 bg-white/5 text-white placeholder:text-slate-500 hover:border-blue-400 focus:border-blue-400" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-200 font-medium">Email Address</span>}
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input 
              placeholder="name@company.com"
              className="h-12 rounded-lg border-slate-600 bg-white/5 text-white placeholder:text-slate-500 hover:border-blue-400 focus:border-blue-400" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-200 font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              placeholder="••••••••"
              className="h-12 rounded-lg border-slate-600 bg-white/5 text-white placeholder:text-slate-500 hover:border-blue-400 focus:border-blue-400" 
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="text-slate-300">Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 border-none rounded-lg text-base font-semibold shadow-lg shadow-blue-900/20 transition-all"
            >
              Register
            </Button>
          </Form.Item>

          <div className="mt-6 text-center border-t border-white/10 pt-6">
            <p className="text-slate-400 text-sm">
              Already have an account? 
              <Link to='/login' className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Registration;
