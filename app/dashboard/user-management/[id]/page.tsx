'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, GraduationCap, Briefcase, Users, Camera, Music, Globe, Shield, Eye, EyeOff, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/apiClient';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Button from '@/components/UI/Button';
import Sidebar from '@/components/UI/Sidebar';
import Header from '@/components/UI/Header';
import Image from 'next/image';

interface UserDetails {
  id: number;
  email: string;
  contact: string | null;
  password: string | null;
  userIdentifier: string | null;
  FCMToken: string;
  signUpMethod: string;
  fullName: string;
  dob: string;
  gender: string;
  interested: string;
  highest_degree: string;
  current_degree: string;
  major: string[];
  profilePic: string;
  alertsToggle: boolean;
  current_profession: string[];
  religion: string;
  caste: string;
  marital_status: string;
  kids: string;
  number_of_kids: number;
  view_children: string;
  living_with: string;
  isDrink: string;
  isSmoke: string;
  isVerified: boolean;
  isOnline: boolean;
  country: string;
  latitude: number;
  longitude: number;
  age: number;
  height: number;
  audio_url: string | null;
  bio: string | null;
  prompt: Array<{
    prompt: string;
    subPrompt: string;
  }>;
  gallery: string[];
  my_interests: string;
  createdAt: string;
  updatedAt: string;
}

const UserDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [activeNav, setActiveNav] = useState('user-management');

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-details-admin', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/v2/user/getUsers`, { 
        params: { userId: userId } 
      });
      return data?.user as UserDetails || null;
    },
    enabled: !!userId,
  });

  // const formatDate = (dateString: string) => {
  //   try {
  //     return new Date(dateString).toLocaleDateString('en-GB', {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDisplayValue = (value: unknown): string => {
    // Debug logging
    console.log('getDisplayValue input:', value, 'Type:', typeof value, 'IsArray:', Array.isArray(value));
    
    // Handle null, undefined, empty string, and zero
    if (value === null || value === undefined || value === '' || value === 0) {
      return 'N/A';
    }
    
    // Handle string representations of empty arrays like "[]"
    if (typeof value === 'string' && (value === '[]' || value.trim() === '[]')) {
      return 'N/A';
    }
    
    // Handle arrays (including empty arrays)
    if (Array.isArray(value)) {
      // For empty arrays, return N/A immediately
      if (value.length === 0) {
        return 'N/A';
      }
      
      // Filter out any null/undefined/empty values from the array
      const validItems = value.filter(item => 
        item !== null && 
        item !== undefined && 
        item !== '' && 
        item !== 0 &&
        (typeof item !== 'string' || item.trim() !== '')
      );
      return validItems.length > 0 ? validItems.join(', ') : 'N/A';
    }
    
    // Handle whitespace-only strings
    if (typeof value === 'string' && value.trim() === '') {
      return 'N/A';
    }
    
    // Handle other falsy values
    if (!value) {
      return 'N/A';
    }
    
    return String(value);
  };

  const handleNavChange = (navId: string) => setActiveNav(navId);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <div className="flex-1 lg:ml-0">
          <Header title="User Details" />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-[400px]">
              <LoadingSpinner />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <div className="flex-1 lg:ml-0">
          <Header title="User Details" />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
              <p className="text-gray-600 mb-6">The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 lg:ml-0">
        <Header title="User Details" />
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to User Management</span>
            </Button>
          </div>

          {/* User Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getDisplayValue(user.fullName)}</h1>
            <p className="text-lg text-gray-600">User Profile & Information</p>
          </div>

          {/* Enhanced Single Row Layout */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Simple Header Section */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-6">
                {/* Simple Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    {user.profilePic ? (
                      <Image 
                        src={user.profilePic} 
                        alt={getDisplayValue(user.fullName)} 
                        width={88}
                        height={88}
                        className="w-22 h-22 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold text-2xl">
                        {getDisplayValue(user.fullName).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Online Status Indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {user.isOnline ? (
                      <Eye className="w-3 h-3 text-white" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>

                {/* User Header Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{getDisplayValue(user.fullName)}</h2>
                  <div className="flex items-center space-x-4 mb-3">
                    {user.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                      <User className="w-3 h-3 mr-1" />
                      ID: {user.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{getDisplayValue(user.email)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{getDisplayValue(user.country)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Age: {getDisplayValue(user.age)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              {/* Information Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.email)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.contact)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.dob)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Height</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.height)} cm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interested In</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.interested)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education & Career */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-rose-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Education & Career</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Highest Degree</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.highest_degree)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Degree</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.current_degree)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Major</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {(() => {
                            const result = getDisplayValue(user.major);
                            console.log('Major value:', user.major, 'Result:', result);
                            return result;
                          })()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profession</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {(() => {
                            const result = getDisplayValue(user.current_profession);
                            console.log('Profession value:', user.current_profession, 'Result:', result);
                            return result;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifestyle & Preferences */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-fuchsia-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Lifestyle & Preferences</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Marital Status</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.marital_status)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kids</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.kids)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Religion</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.religion)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Drinking</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.isDrink)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Smoking</p>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(user.isSmoke)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-pink-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                    <p className="text-xs font-medium text-pink-400 uppercase tracking-wide mb-1">Sign Up Method</p>
                    <p className="text-sm font-bold text-gray-700 capitalize">{getDisplayValue(user.signUpMethod)}</p>
                  </div>
                  
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-xs font-medium text-rose-400 uppercase tracking-wide mb-1">Alerts</p>
                    <p className={`text-sm font-bold ${user.alertsToggle ? 'text-gray-700' : 'text-gray-500'}`}>
                      {user.alertsToggle ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-fuchsia-50 rounded-xl border border-fuchsia-100">
                    <p className="text-xs font-medium text-fuchsia-400 uppercase tracking-wide mb-1">Created</p>
                    <p className="text-sm font-bold text-gray-700">{formatDateTime(user.createdAt)}</p>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                    <p className="text-xs font-medium text-pink-400 uppercase tracking-wide mb-1">Last Updated</p>
                    <p className="text-sm font-bold text-gray-700">{formatDateTime(user.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Bio and Interests */}
              {(user.bio || user.my_interests) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-rose-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Bio & Interests</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.bio && (
                      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          Bio
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{getDisplayValue(user.bio)}</p>
                      </div>
                    )}
                    {user.my_interests && (
                      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Heart className="w-4 h-4 mr-2 text-gray-500" />
                          Interests
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{getDisplayValue(user.my_interests)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Prompts */}
              {user.prompt && user.prompt.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-fuchsia-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Prompts</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.prompt.map((prompt, index) => (
                      <div key={index} className="p-4 bg-fuchsia-50 rounded-xl border border-fuchsia-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">{getDisplayValue(prompt.prompt)}</p>
                        <p className="text-sm text-gray-600">{getDisplayValue(prompt.subPrompt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery and Audio */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-pink-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Media</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gallery */}
                  {(() => {
                    // Filter out null, undefined, or empty images
                    const validImages = user.gallery?.filter(image => 
                      image && 
                      image.trim() !== '' && 
                      image !== null && 
                      image !== undefined
                    ) || [];
                    
                    return validImages.length > 0 && (
                      <div className="p-6 bg-pink-50 rounded-xl border border-pink-100">
                        <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                          <Camera className="w-4 h-4 mr-2 text-gray-500" />
                          Gallery ({validImages.length} photos)
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {validImages.map((image, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                              <Image 
                                src={image} 
                                alt={`Gallery ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Audio */}
                  {user.audio_url && (
                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                      <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                        <Music className="w-4 h-4 mr-2 text-gray-500" />
                        Audio Recording
                      </p>
                      <audio controls className="w-full rounded-lg">
                        <source src={user.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetailsPage;
