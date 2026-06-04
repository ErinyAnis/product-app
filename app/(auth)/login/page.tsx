"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validations/loginSchema";
import { Loader2, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loading = isSubmitting || isLoading;
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      router.replace("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-md w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Login to browse products
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              autoFocus
              type="text"
              id="username"
              placeholder="Enter your username"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Test account */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Test account:{" "}
            <span className="font-medium text-gray-600">emilys</span> /{" "}
            <span className="font-medium text-gray-600">emilyspass</span>
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
