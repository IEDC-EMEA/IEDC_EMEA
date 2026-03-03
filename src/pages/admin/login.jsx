import React, { useState, useEffect } from "react";
import { Input } from "@/components2/ui/input";
import { Button } from "@/components2/ui/button";
import { EyeOff, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/createClient';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components2/ui/form";
import { LoadingButton } from "@/components2/ui/loading-button";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion } from "framer-motion";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parent] = useAutoAnimate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userRole = session.user.user_metadata?.role || 'user';
          if (userRole === 'admin') {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, [navigate]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      const userRole = user.user_metadata?.role || 'user';
      
      toast.success("You have successfully signed in!");
      
      if (userRole === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Error signing in:", error);
      
      let errorMessage = "Failed to sign in. Please check your credentials.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before signing in.";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFillTestData = () => {
    form.setValue("email", "admin@example.com");
    form.setValue("password", "password123");
    toast.info("Test credentials filled. Click Sign In to test.");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100"
      >
        {/* Header Section */}
        <div className="bg-emerald-600 text-white p-6 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-4"
          >
            <Sparkles className="h-8 w-8 mr-2" />
            <h1 className="text-3xl font-bold">IEDC EMEA</h1>
          </motion.div>
          <p className="text-emerald-100">Admin Portal</p>
        </div>

        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600 mt-1">Sign in to your admin account</p>
            </div>

            {/* Test Credentials (for development only) */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <p className="text-center text-emerald-700 font-medium mb-2">
                  For testing purposes
                </p>
                <Button
                  onClick={handleFillTestData}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold mb-3 transition-colors duration-200"
                  type="button"
                >
                  Fill Test Credentials
                </Button>
              </>
            )}

         
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                ref={parent}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 transition-colors duration-200"
                          placeholder="Enter your email"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem ref={parent}>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-12 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 transition-colors duration-200"
                            placeholder="Enter your password"
                            {...field}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                            onClick={toggleShowPassword}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                      <div className="text-right mt-2">
                        <div className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200 mb-1">
                          Forgot password? Contact WhatsApp
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <LoadingButton
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-lg transition-colors duration-200"
                  loading={loading}
                  type="submit"
                >
                  Sign In
                </LoadingButton>
              </form>
            </Form>
          </div>

     
        </div>

        {/* Brand Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <a
            href="https://wa.me/8089465673"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 underline transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.49" />
            </svg>
            Contact via WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;