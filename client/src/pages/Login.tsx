import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { FaRocket } from "react-icons/fa";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";
import { User } from "@/types";


interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth as { user: User | null }
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const submitHandler = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/login`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
        dispatch(setCredentials(response.data));
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Invalid credentials!");
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-gray-900">
      <div className="w-full md:w-auto flex gap-0 md:gap-20 lg:gap-32 flex-col lg:flex-row items-center justify-center px-4">
        {/* Left side - Hero Section */}
        <div className="h-full w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-lg xl:max-w-2xl flex flex-col items-center justify-center gap-6 lg:gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 py-2 px-4 bg-primary-900/20 border border-primary-700 rounded-full text-sm font-medium text-primary-300">
              <FaRocket size={16} />
              <span>Streamline your workflow</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent leading-tight">
                Nexus
              </h1>
              <p className="text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-300">
                Task Manager
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Manage all your tasks in one place with our powerful project
              management platform designed for modern teams.
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="card p-8 space-y-6"
            >
              {/* Form Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
                <p className="text-gray-400">Sign in to your account</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Textbox
                  placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full"
                  register={register("email", {
                    required: "Email Address is required!",
                  })}
                  error={errors.email ? errors.email.message : ""}
                />
                <Textbox
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  label="Password"
                  className="w-full"
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
              </div>

              {/* Submit Button */}
              {loading ? (
                <Button
                  label="Signing in..."
                  className="w-full h-12 bg-gray-700 cursor-wait text-gray-400"
                  disabled
                />
              ) : (
                <Button
                  type="submit"
                  label="Sign In"
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-glow"
                />
              )}

              {/* Register Link */}
              <div className="text-center text-sm">
                <span className="text-gray-400">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-primary-400 hover:text-primary-300 font-medium underline-offset-2 hover:underline transition-colors"
                >
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

