'use client';

import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { validateEmail } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { toast } from 'sonner';
import Button from './UI/Button';
import Input from './UI/Input';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      toast.error('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Handle password reset logic here
      console.log('Password reset requested for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset link sent to your email');
      setIsSubmitted(true);
    } catch {
      toast.error(ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
            <FiMail className="h-6 w-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-sm text-coral-400 hover:text-coral-300 hover:underline mb-4 block cursor-pointer"
          >
            Try another email address
          </button>
          <button
            onClick={onBackToLogin}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg text-gray-300 font-medium text-sm border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-sm">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email address"
          required
          icon={<FiMail />}
          iconPosition="left"
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg text-gray-300 font-medium text-sm border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
