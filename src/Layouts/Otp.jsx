import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useVerifyOtpMutation } from "../Slices/apiSlice";
import { Input, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { MailCheck, ArrowRight, ShieldCheck } from "lucide-react";

const Otp = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [otpVal, setOtpVal] = useState(params.otpcode || "");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  useEffect(() => {
    if (params.email && params.otpcode) {
      verifyCode(params.otpcode);
    }
  }, [params.email, params.otpcode]);

  const verifyCode = async (codeToVerify) => {
    const code = codeToVerify || otpVal;
    if (!code) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    try {
      const res = await verifyOtp({
        email: params.email,
        otp: code,
      }).unwrap();

      if (res?.success) {
        toast.success("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(res?.error || "Invalid OTP code");
      }
    } catch (err) {
      toast.error(err?.data?.error || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Verify Email Address
        </h1>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          A verification code has been dispatched to{" "}
          <span className="font-semibold text-slate-800">{params.email || "your email"}</span>
        </p>

        <div className="mb-6 flex justify-center">
          <Input.OTP
            length={6}
            value={otpVal}
            onChange={(val) => setOtpVal(val)}
            size="large"
            className="text-slate-800"
          />
        </div>

        <Button
          type="primary"
          onClick={() => verifyCode()}
          loading={isLoading}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 mb-4"
        >
          <span>Confirm Verification</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <div className="text-xs text-slate-500">
          <span>Remember your password? </span>
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Otp;