"use client";

import { useForm } from "react-hook-form";
import { loginSchema, LoginTypes } from "./api/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import logo from "@/assets/logo.svg"; // Adjust the path as necessary
import InputField from "@/components/ui/input-field";
import PasswordField from "@/components/ui/password-field";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = (data: LoginTypes) => {
    console.log("Form submitted with data:", data);
    router.push("/admin/dashboard"); // Redirect to dashboard after login
    // Handle login logic here
  };

  return (
    <section className=" flex w-full justify-center">
      <form
        className=" w-96 mt-24 space-y-12 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full justify-center">
          <Image src={logo} alt="Logo" />
        </div>
        <h1 className=" text-orange-500 text-center">Login</h1>
        <div className=" space-y-8">
          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            id="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-[14px] hover:bg-orange-600 transition-colors"
        >
          Login
        </button>
      </form>
    </section>
  );
}
