'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import { LoginFormData } from '@/types';
import { validateEmail } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import Button from './UI/Button';
import Input from './UI/Input';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSignUp }) => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    
    // Show toast for first validation error
    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      toast.error(firstError);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Logged in successfully');
        console.log('Login successful, redirecting to dashboard...');
        // Use replace to avoid back button issues
        router.replace('/dashboard');
      } else {
        toast.error(ERROR_MESSAGES.GENERIC);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        toast.error('Invalid email or password');
      } else {
        toast.error(ERROR_MESSAGES.GENERIC);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-400 text-sm">
          Please enter your details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          required
          error={errors.email}
          icon={<FiMail />}
          iconPosition="left"
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            required
            error={errors.password}
            icon={<FiLock />}
            iconPosition="left"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center top-6 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer text-gray-300">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-coral-400 hover:text-coral-300 hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>

        <div className="text-center pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
          </span>
          <button
            type="button"
            onClick={onSignUp}
            className="text-sm text-coral-400 hover:text-coral-300 hover:underline font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
