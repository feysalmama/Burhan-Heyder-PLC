"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Building2 } from "lucide-react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.email, credentials.password);
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Section - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Burhan Heyder PLC
            </span>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Sign in to access your dashboard and continue managing your metal
              importing operations.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="pl-10 h-12 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <span>Continue with Google</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-gray-600 text-lg">🍎</span>
                  </div>
                  <span>Continue with Apple</span>
                </div>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-gray-600">
              Don't have an Account?{" "}
              <Link
                href="/register"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Marketing */}
      <div className="flex-1 bg-gradient-to-br from-teal-600 to-green-800 flex items-center justify-center p-8">
        <div className="text-white max-w-md">
          {/* Main Headline */}
          <h2 className="text-4xl font-bold mb-8">
            Revolutionize Metal Trading with Smart Management
          </h2>

          {/* Testimonial */}
          <div className="mb-12">
            <div className="text-6xl font-bold mb-4">"</div>
            <blockquote className="text-lg leading-relaxed mb-6">
              Burhan Heyder PLC has completely transformed our metal importing
              process. It's reliable, efficient, and ensures our supply chain is
              always optimized.
            </blockquote>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full mr-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">Ahmed Hassan</div>
                <div className="text-teal-200">
                  Construction Manager at BuildCorp
                </div>
              </div>
            </div>
          </div>

          {/* Join Teams Section */}
          <div>
            <div className="text-sm uppercase tracking-wider mb-4">
              TRUSTED BY 500+ COMPANIES
            </div>

            {/* Company Logos Row 1 */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">BuildCorp</div>
              <div className="text-white font-semibold">SteelWorks</div>
              <div className="text-white font-semibold">MetalMax</div>
              <div className="text-white font-semibold">IronGate</div>
            </div>

            {/* Company Logos Row 2 */}
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">ConstructPro</div>
              <div className="text-white font-semibold">SteelTech</div>
              <div className="text-white font-semibold">MetalCore</div>
              <div className="text-white font-semibold">BuildMaster</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
