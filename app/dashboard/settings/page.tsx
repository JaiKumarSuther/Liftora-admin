'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiShield,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { API_ENDPOINTS } from '@/constants';
import api from '@/utils/apiClient';
import { useAuth } from '@/components/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Image from 'next/image';

const Settings: React.FC = () => {
  const [activeNav, setActiveNav] = useState('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch admin profile data - use user endpoint since admin endpoint has field mismatch
  const { data: adminProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        // Use user endpoint since admin endpoint has firstName/lastName field issues
        const { data } = await api.get(API_ENDPOINTS.USERS.LIST, {
          params: { userId: user.id }
        });
        return data?.user || null;
      } catch (error) {
        console.warn('User profile endpoint failed, using fallback data:', error);
        // Fallback to user data if endpoint fails
        return {
          name: user.name || '',
          email: user.email || '',
          contact: '',
          profilePic: user.avatarUrl || ''
        };
      }
    },
    enabled: !!user?.id
  });

  // Update profile data when admin profile is loaded
  useEffect(() => {
    if (adminProfile) {
      // Handle both admin profile format and user profile format
      setProfileData({
        name: adminProfile.name || adminProfile.fullName || '',
        email: adminProfile.email || '',
        phone: adminProfile.contact || adminProfile.phone || '',
        timezone: adminProfile.timezone || 'UTC-5 (Eastern Time)'
      });
    } else if (user) {
      // Fallback to user data if no admin profile
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        timezone: 'UTC-5 (Eastern Time)'
      });
    }
  }, [adminProfile, user]);

  // Update profile mutation - use user endpoint since admin endpoint has field issues
  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      if (!user?.id) throw new Error('User ID not found');
      // Use user endpoint directly since admin endpoint has firstName/lastName field issues
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE, {
        name: data.name.trim(),
        email: data.email,
        contact: data.phone
      }, {
        params: { userId: user.id }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-profile', user?.id] });
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update profile'
        : 'Failed to update profile';
      toast.error(errorMessage);
    }
  });

  // Update password mutation - use user endpoint since admin endpoint has field issues
  const updatePassword = useMutation({
    mutationFn: async (data: typeof securityData) => {
      if (!user?.id) throw new Error('User ID not found');
      // Use user password reset endpoint since admin endpoint has field issues
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: user.email,
        password: data.newPassword
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update password'
        : 'Failed to update password';
      toast.error(errorMessage);
    }
  });

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isTimezoneDropdownOpen) {
        setIsTimezoneDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isTimezoneDropdownOpen]);

  const handleSave = async () => {
    if (activeTab === 'profile') {
      // Validate profile data
      if (!profileData.name.trim()) {
        toast.error('Name is required');
        return;
      }
      
      if (!profileData.email.trim()) {
        toast.error('Email is required');
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      updateProfile.mutate(profileData);
    } else if (activeTab === 'security') {
      if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
        toast.error('Please fill in all password fields');
        return;
      }
      
      if (securityData.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long');
        return;
      }
      
      if (securityData.newPassword !== securityData.confirmPassword) {
        toast.error('New password and confirm password do not match');
        return;
      }
      
      updatePassword.mutate(securityData);
    }
  };

  const handleCancel = () => {
    if (activeTab === 'profile') {
      // Reset profile data to original values
      if (adminProfile) {
        setProfileData({
          name: adminProfile.name || adminProfile.fullName || '',
          email: adminProfile.email || '',
          phone: adminProfile.contact || adminProfile.phone || '',
          timezone: adminProfile.timezone || 'UTC-5 (Eastern Time)'
        });
      } else if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          timezone: 'UTC-5 (Eastern Time)'
        });
      }
    } else if (activeTab === 'security') {
      // Clear security data
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    toast.info('Changes discarded');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file || !user?.id) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      inputEl.value = '';
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      inputEl.value = '';
      return;
    }
    
    try {
      setIsUploadingAvatar(true);
      const form = new FormData();
      form.append('profilePic', file);
      
      // Use the correct API endpoint for profile image upload
      const res = await api.put(API_ENDPOINTS.USERS.UPDATE, form, {
        params: { userId: user.id },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const updated = res.data?.user;
      if (updated?.profilePic) {
        updateUser({ avatarUrl: updated.profilePic });
        toast.success('Profile picture updated successfully');
      } else if (res.data?.status) {
        toast.success('Profile picture updated successfully');
        // Refresh the profile data
        queryClient.invalidateQueries({ queryKey: ['admin-profile', user?.id] });
      }
    } catch (err: unknown) {
      console.error('Failed to upload avatar', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 
          (err as { message?: string }).message || 'Failed to upload profile picture'
        : 'Failed to upload profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
      // reset input value so same file can be selected again
      if (inputEl) inputEl.value = '';
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-700 flex items-center justify-center">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-300">
              {user?.initials}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
          <div className="flex items-center gap-3">
            <label className={`px-3 py-2 rounded-md border border-gray-600 text-sm cursor-pointer text-gray-300 ${isUploadingAvatar ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700 hover:text-white'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
              {isUploadingAvatar ? 'Uploading...' : 'Upload Image'}
            </label>
            {user?.avatarUrl && (
              <a href={user.avatarUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-400 underline hover:text-gray-300">View current</a>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Uploads immediately and is independent of Save Changes.</p>
        </div>
      </div>

      <Input
        label="Full Name"
        value={profileData.name}
        onChange={(value) => setProfileData({ ...profileData, name: value })}
        placeholder="Enter your full name"
      />
      <Input
        label="Email Address"
        type="email"
        value={profileData.email}
        onChange={(value) => setProfileData({ ...profileData, email: value })}
        placeholder="Enter email address"
      />
      <Input
        label="Phone Number"
        type="tel"
        value={profileData.phone}
        onChange={(value) => setProfileData({ ...profileData, phone: value })}
        placeholder="Enter phone number"
      />
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Timezone
        </label>
        <button
          type="button"
          onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-300 focus:outline-none focus:ring-coral-500 focus:border-coral-500"
        >
          <span>{profileData.timezone}</span>
          {isTimezoneDropdownOpen ? (
            <FiChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isTimezoneDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
            {[
              'UTC-5 (Eastern Time)',
              'UTC-6 (Central Time)',
              'UTC-7 (Mountain Time)',
              'UTC-8 (Pacific Time)'
            ].map((timezone) => (
              <button
                key={timezone}
                type="button"
                onClick={() => {
                  setProfileData({ ...profileData, timezone });
                  setIsTimezoneDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 ${
                  profileData.timezone === timezone ? 'bg-coral-500 text-white' : ''
                }`}
              >
                {timezone}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Input
        label="Current Password"
        type="password"
        value={securityData.currentPassword}
        onChange={(value) => setSecurityData({ ...securityData, currentPassword: value })}
        placeholder="Enter current password"
      />
      <Input
        label="New Password"
        type="password"
        value={securityData.newPassword}
        onChange={(value) => setSecurityData({ ...securityData, newPassword: value })}
        placeholder="Enter new password"
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={securityData.confirmPassword}
        onChange={(value) => setSecurityData({ ...securityData, confirmPassword: value })}
        placeholder="Confirm new password"
      />
    </div>
  );

  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <Header title="Settings" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {profileLoading ? (
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-10 flex justify-center items-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-coral-500 text-coral-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-700">
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={updateProfile.isPending || updatePassword.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                loading={updateProfile.isPending || updatePassword.isPending}
              >
                {updateProfile.isPending || updatePassword.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
