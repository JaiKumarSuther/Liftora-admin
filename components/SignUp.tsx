'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiEye, FiEyeOff, FiCheck, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { API_ENDPOINTS } from '@/constants';
import { useMutation } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import { handleApiError, validateEmail } from '@/utils';
import { toast } from 'sonner';
import Button from './UI/Button';
import Input from './UI/Input';
import Modal from './UI/Modal';

interface SignUpProps {
  onBackToLogin: () => void;
}

export default function SignUp({ onBackToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const signupMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('fullName', `${formData.firstName} ${formData.lastName}`.trim());
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('signUpMethod', 'mail');
      const { data } = await api.post(API_ENDPOINTS.AUTH.SIGNUP, form);
      return data;
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      setIsSubmitted(true);
      setError(null);
    },
    onError: (e) => {
      setError(handleApiError(e));
      toast.error(handleApiError(e));
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError(null);
    signupMutation.mutate();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
            <FiCheck className="h-6 w-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Account Created!
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Welcome to Liftora! Your account has been successfully created.
          </p>
          <Button
            onClick={onBackToLogin}
            className="w-full"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-400 text-sm">
          Join Liftora and start your journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3" role="alert">
            {error}
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="First name"
            required
            error={errors.firstName}
            icon={<FiUser />}
            iconPosition="left"
          />
          <Input
            type="text"
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Last name"
            required
            error={errors.lastName}
            icon={<FiUser />}
            iconPosition="left"
          />
        </div>

        {/* Email Input */}
        <Input
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          required
          error={errors.email}
          icon={<FiMail />}
          iconPosition="left"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            placeholder="Confirm your password"
            required
            error={errors.confirmPassword}
            icon={<FiLock />}
            iconPosition="left"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center top-6 cursor-pointer"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            id="agree-terms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="h-4 w-4 text-coral-500 focus:ring-coral-500 border-gray-600 rounded mt-1 bg-gray-700"
            required
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm cursor-pointer text-gray-300">
            I agree to the{' '}
            <button 
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="text-coral-400 hover:text-coral-300 hover:underline focus:outline-none"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button 
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-coral-400 hover:text-coral-300 hover:underline focus:outline-none"
            >
              Privacy Policy
            </button>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-400">{errors.agreeToTerms}</p>
        )}

        {/* Sign Up Button */}
        <Button
          type="submit"
          loading={signupMutation.isPending}
          disabled={signupMutation.isPending}
          className="w-full"
        >
          {signupMutation.isPending ? 'Creating...' : 'Create Account'}
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg text-gray-300 font-medium text-sm border border-gray-600 hover:bg-gray-700 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </form>

      {/* Terms of Service Modal */}
      {isTermsModalOpen && (
        <Modal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          title="Terms of Service"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-300">
                By accessing and using Liftora services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h3 className="text-lg font-semibold text-white">2. Use License</h3>
              <p className="text-sm text-gray-300">
                Permission is granted to temporarily download one copy of Liftora per device for personal, non-commercial transitory viewing only.
              </p>

              <h3 className="text-lg font-semibold text-white">3. Subscription Services</h3>
              <p className="text-sm text-gray-300">
                Our subscription services are billed on a recurring basis. You can cancel your subscription at any time through your account settings.
              </p>

              <h3 className="text-lg font-semibold text-white">4. User Accounts</h3>
              <p className="text-sm text-gray-300">
                You are responsible for safeguarding the password and for maintaining the confidentiality of your account.
              </p>

              <h3 className="text-lg font-semibold text-white">5. Privacy Policy</h3>
              <p className="text-sm text-gray-300">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
              </p>

              <h3 className="text-lg font-semibold text-white">6. Prohibited Uses</h3>
              <p className="text-sm text-gray-300">
                You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.
              </p>

              <h3 className="text-lg font-semibold text-white">7. Termination</h3>
              <p className="text-sm text-gray-300">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service.
              </p>

              <h3 className="text-lg font-semibold text-white">8. Changes to Terms</h3>
              <p className="text-sm text-gray-300">
                We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page.
              </p>

              <h3 className="text-lg font-semibold text-white">9. Contact Information</h3>
              <p className="text-sm text-gray-300">
                If you have any questions about these Terms of Service, please contact us at legal@liftora.com.
              </p>

              <div className="text-xs text-gray-400 pt-4 border-t border-gray-700">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <Modal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          title="Privacy Policy"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">1. Information We Collect</h3>
              <p className="text-sm text-gray-300">
                We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support.
              </p>

              <h3 className="text-lg font-semibold text-white">2. How We Use Your Information</h3>
              <p className="text-sm text-gray-300">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>

              <h3 className="text-lg font-semibold text-white">3. Information Sharing</h3>
              <p className="text-sm text-gray-300">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>

              <h3 className="text-lg font-semibold text-white">4. Data Security</h3>
              <p className="text-sm text-gray-300">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3 className="text-lg font-semibold text-white">5. Cookies and Tracking</h3>
              <p className="text-sm text-gray-300">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information.
              </p>

              <h3 className="text-lg font-semibold text-white">6. Third-Party Services</h3>
              <p className="text-sm text-gray-300">
                Our service may contain links to third-party websites or services that are not owned or controlled by Liftora.
              </p>

              <h3 className="text-lg font-semibold text-white">7. Children&apos;s Privacy</h3>
              <p className="text-sm text-gray-300">
                Our service does not address anyone under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h3 className="text-lg font-semibold text-white">8. Your Rights</h3>
              <p className="text-sm text-gray-300">
                You have the right to access, update, or delete the information we have on you. You may also opt out of certain communications from us.
              </p>

              <h3 className="text-lg font-semibold text-white">9. International Transfers</h3>
              <p className="text-sm text-gray-300">
                Your information may be transferred to and processed in countries other than your own, which may have different data protection laws.
              </p>

              <h3 className="text-lg font-semibold text-white">10. Changes to This Policy</h3>
              <p className="text-sm text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>

              <h3 className="text-lg font-semibold text-white">11. Contact Us</h3>
              <p className="text-sm text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at privacy@liftora.com.
              </p>

              <div className="text-xs text-gray-400 pt-4 border-t border-gray-700">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
