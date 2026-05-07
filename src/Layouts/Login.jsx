import { ToastContainer, toast } from "react-toastify";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authInfo } from "../Slices/AuthSlices";

function Login() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const apiBaseUrl = import.meta.env.VITE_LOCAL_API;

  const onFinish = async (values) => {
    if (!apiBaseUrl) {
      toast.error("API URL is missing. Set VITE_LOCAL_API in .env");
      return;
    }

    try {
      let data = await axios.post(`${apiBaseUrl}/api/v1/auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (data.data.error === "user does not exist") {
        toast.error(data.data.error);
      } else if (!data.data.emailVerified) {
        toast.error("verify your email");
      } else if (data.data.role === "user") {
        toast.error("Please Upgrade to merchant to login");
      } else {
        dispatch(authInfo(data.data));
        localStorage.setItem("userinfo", JSON.stringify(data.data));
        navigate("/dashboard/viewbanner");
        toast.success("Login success");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
    }
  };

  const onFinishFailed = () => {
    toast.error("Please fill in required fields");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0c3635] to-slate-900 px-4">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="colored"
      />

      {/* Modern Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Merchant Login
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            Enter your credentials to access the dashboard
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
            label={<span className="text-slate-200 font-medium">Email Address</span>}
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input 
              placeholder="name@company.com"
              className="h-12 rounded-lg border-slate-600 bg-white/5 text-white placeholder:text-slate-500 hover:border-emerald-400 focus:border-emerald-400" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-200 font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password 
              placeholder="••••••••"
              className="h-12 rounded-lg border-slate-600 bg-white/5 text-white placeholder:text-slate-500 hover:border-emerald-400 focus:border-emerald-400" 
            />
          </Form.Item>

          <div className="flex items-center justify-between mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-300">Remember me</Checkbox>
            </Form.Item>
            <Link 
              to="/forgetpassword" 
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 border-none rounded-lg text-base font-semibold shadow-lg shadow-emerald-900/20 transition-all"
            >
              Sign In
            </Button>
          </Form.Item>

          <div className="mt-6 text-center border-t border-white/10 pt-6">
            <p className="text-slate-400 text-sm">
              New here? 
              <Link to="/" className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors underline">
                Create an account
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
