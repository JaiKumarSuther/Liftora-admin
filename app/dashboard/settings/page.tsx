'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiShield
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
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch admin profile data
  const { data: adminProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await api.get(API_ENDPOINTS.ADMIN.PROFILE, {
        params: { userId: user.id }
      });
      return data?.data || null;
    },
    enabled: !!user?.id
  });

  // Update profile data when admin profile is loaded
  useEffect(() => {
    if (adminProfile) {
      setProfileData({
        firstName: adminProfile.firstName || '',
        lastName: adminProfile.lastName || '',
        email: adminProfile.email || '',
        phone: adminProfile.phone || '',
        timezone: adminProfile.timezone || 'UTC-5 (Eastern Time)'
      });
    }
  }, [adminProfile]);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileData) => {
      if (!user?.id) throw new Error('User ID not found');
      const response = await api.put(API_ENDPOINTS.ADMIN.PROFILE, data, {
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

  // Update password mutation
  const updatePassword = useMutation({
    mutationFn: async (data: typeof securityData) => {
      if (!user?.id) throw new Error('User ID not found');
      const response = await api.put(API_ENDPOINTS.ADMIN.PASSWORD, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }, {
        params: { userId: user.id }
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

  const handleSave = async () => {
    if (activeTab === 'profile') {
      updateProfile.mutate(profileData);
    } else if (activeTab === 'security') {
      if (securityData.currentPassword && securityData.newPassword && securityData.confirmPassword) {
        updatePassword.mutate(securityData);
      } else {
        toast.error('Please fill in all password fields');
      }
    }
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
      const res = await api.put(`${API_ENDPOINTS.USERS.UPLOAD_PROFILE_PIC}?userId=${user.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res.data?.user;
      if (updated?.profilePic) {
        updateUser({ avatarUrl: updated.profilePic });
        toast.success('Profile picture updated successfully');
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
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-700">
              {user?.initials}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <div className="flex items-center gap-3">
            <label className={`px-3 py-2 rounded-md border text-sm cursor-pointer ${isUploadingAvatar ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
              {isUploadingAvatar ? 'Uploading...' : 'Upload Image'}
            </label>
            {user?.avatarUrl && (
              <a href={user.avatarUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 underline">View current</a>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploads immediately and is independent of Save Changes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={profileData.firstName}
          onChange={(value) => setProfileData({ ...profileData, firstName: value })}
          placeholder="Enter first name"
        />
        <Input
          label="Last Name"
          value={profileData.lastName}
          onChange={(value) => setProfileData({ ...profileData, lastName: value })}
          placeholder="Enter last name"
        />
      </div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={profileData.timezone}
          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
        >
          <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
          <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
          <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
          <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
        </select>
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
      <div className="flex-1 lg:ml-0">
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
              <Button variant="secondary" onClick={() => console.log('Cancel clicked')}>
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
