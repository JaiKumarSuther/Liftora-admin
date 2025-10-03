'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import ForgotPassword from '../components/ForgotPassword';
import SignUp from '../components/SignUp';

type ViewType = 'login' | 'forgot-password' | 'signup';

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleSignUp = () => {
    setCurrentView('signup');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={handleBackToLogin} />;
      case 'signup':
        return <SignUp onBackToLogin={handleBackToLogin} />;
      default:
        return <LoginForm onForgotPassword={handleForgotPassword} onSignUp={handleSignUp} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Image
            src="/assets/logo.png"
            alt="Liftora Logo"
            width={160}
            height={48}
            className="w-24 mx-auto"
            priority
          />
        </div>

        {/* Form */}
        {renderCurrentView()}
      </div>
    </div>
  );
}
