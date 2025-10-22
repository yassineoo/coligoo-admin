"use client";

import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import auth from "@/app/api/auth";
import { toast } from "@/../hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

function parseApiError(err: any) {
  if (!err) return "Unknown error";
  const body = err?.body ?? err;
  if (body == null) return err?.message ?? String(err);
  if (typeof body === "string") return body;
  if (Array.isArray(body.message)) return body.message.join(", ");
  if (typeof body.message === "string") return body.message;
  if (body.fr || body.ar) return body.fr ?? body.ar;
  if (body?.data?.message) {
    if (Array.isArray(body.data.message)) return body.data.message.join(", ");
    return String(body.data.message);
  }
  return err?.message ?? JSON.stringify(body);
}

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [fpEmailOrPhone, setFpEmailOrPhone] = useState("");
  const [fpSubmitting, setFpSubmitting] = useState(false);
  const [fpSuccess, setFpSuccess] = useState(false);
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    fpEmailOrPhone: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrors({
      identifier: "",
      password: "",
      fpEmailOrPhone: "",
    });

    let hasError = false;

    if (!identifier.trim()) {
      setErrors((prev) => ({
        ...prev,
        identifier: "Email is required.",
      }));
      hasError = true;
    }
    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
      hasError = true;
    }

    if (hasError) return;

    setSubmitting(true);
    const t = toast({
      title: "Signing in",
      description: "Please wait...",
      open: true,
      duration: 10000,
    });
    try {
      const res = await auth.loginAdmin({ email: identifier, password });
      const userInfo = (res && (res.userInfo ?? res.data?.userInfo)) ?? null;
      const token =
        (res && (res.token ?? res.accessToken ?? res.data?.token)) ?? null;
      if (token) auth.setToken(token);
      if (userInfo) {
        try {
          localStorage.setItem("user", JSON.stringify(userInfo));
        } catch {}
      }
      t.update({
        title: "Signed in",
        description: "You are now signed in.",
        variant: "success",
        duration: 3000,
      });
      router.push("/dashboard");
    } catch (err: any) {
      const message = parseApiError(err);
      t.update({
        title: "Sign in failed",
        description: message,
        variant: "error",
        duration: 7000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  function openForgot() {
    setErrors((prev) => ({ ...prev, fpEmailOrPhone: "" }));
    setFpEmailOrPhone("");
    setFpSubmitting(false);
    setFpSuccess(false);
    setForgotOpen(true);
  }

  async function handleSendReset() {
    if (fpSubmitting) return;

    setErrors((prev) => ({ ...prev, fpEmailOrPhone: "" }));

    if (!fpEmailOrPhone.trim()) {
      setErrors((prev) => ({
        ...prev,
        fpEmailOrPhone: "Email is required.",
      }));
      return;
    }

    const getCallbackUrl = () => {
      const envBase = process.env.NEXTAUTH_URL?.trim();
      if (envBase && envBase !== "") {
        const base = envBase.replace(/\/+$/, "");
        return `${base}/forgot_password`;
      }
      if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin + "/forgot_password";
      }
      return "https://coligoo.com";
    };

    const callbackUrl = getCallbackUrl();

    setFpSubmitting(true);
    const t = toast({
      title: "Processing",
      description: "Please wait...",
      open: true,
      duration: 10000,
    });
    try {
      const payload: any = { callbackUrl };
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmailOrPhone.trim())) {
        payload.email = fpEmailOrPhone.trim();
      } else {
        payload.phone = fpEmailOrPhone.trim();
      }
      await auth.sendResetLink(payload);
      t.update({
        title: "Reset link sent",
        description:
          "Un lien de réinitialisation a été envoyé. Vérifiez votre email.",
        variant: "success",
        duration: 5000,
      });
      setFpSuccess(true);
    } catch (err: any) {
      t.update({
        title: "Failed",
        description: parseApiError(err),
        variant: "error",
        duration: 7000,
      });
    } finally {
      setFpSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full bg-[#F7F7FB] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-[40px] xl:mb-[60px]">
            <Image
              src="/logo.svg"
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="mx-auto w-[63.11px] h-[59px]"
            />
          </div>

          <div className="space-y-4">
            <div className="text-center ">
              <h1
                className="text-[32px] font-semibold text-[#FF5901] mb-3"
                style={{ color: "#FF5901" }}
              >
                Sign In
              </h1>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full h-[46px] px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[46px] px-[14px] pr-12 border border-[#EDF1F3] rounded-[10px] bg-white text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACB5BB]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-xs text-[#7C8BA0] hover:text-[#FF5901]"
                >
                  Forget Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-[#FF5901] text-white text-base font-medium rounded-[14px] hover:bg-[#E64F01] transition-colors disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
      {forgotOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setForgotOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <button
              className="absolute right-4 top-4 text-[#7C8BA0]"
              onClick={() => setForgotOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[32px] text-center font-semibold mx-auto text-[#FF5901] mb-4">
              Reset password
            </h2>

            {!fpSuccess && (
              <>
                <p className="text-sm text-[#7C8BA0] px-2 mb-4">
                  Enter your email. We will send you a link to reset your
                  password.
                </p>

                <div className="relative mt-8">
                  <input
                    type="text"
                    value={fpEmailOrPhone}
                    onChange={(e) => setFpEmailOrPhone(e.target.value)}
                    className="w-full h-[46px] px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                    placeholder="Enter your email address"
                  />
                  {errors.fpEmailOrPhone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fpEmailOrPhone}
                    </p>
                  )}
                </div>

                <div className="flex mt-8 gap-2">
                  <button
                    onClick={handleSendReset}
                    className="flex-1 h-11 rounded-lg bg-[#FF5901] text-white font-medium hover:bg-[#E64F01] disabled:opacity-60"
                    disabled={fpSubmitting}
                  >
                    {fpSubmitting ? "Sending..." : "Send reset link"}
                  </button>
                  <button
                    onClick={() => setForgotOpen(false)}
                    className="h-11 px-4 rounded-lg border border-[#E6E9EE] bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {fpSuccess && (
              <div className="text-center py-6">
                <svg
                  className="mx-auto mb-4 w-12 h-12 text-[#2dd4bf]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <h3 className="font-semibold text-lg text-[#111827] mb-2">
                  Link sent
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  We just sent you an email to <strong>{fpEmailOrPhone}</strong>
                  . Click the link to reset your password. If you don't receive
                  the email, check your spam folder.
                </p>
                <button
                  onClick={() => setForgotOpen(false)}
                  className="inline-block px-6 py-2 rounded-lg bg-[#FF5901] text-white font-medium hover:bg-[#E64F01]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
