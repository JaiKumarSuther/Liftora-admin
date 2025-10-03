import * as XLSX from 'xlsx';
import api from './apiClient';

export interface ExportEventData {
  id: string;
  eventName: string;
  eventType: string;
  description: string;
  location: string;
  repeat: string;
  date: string;
  time: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportUserData {
  id: string;
  fullName: string;
  email: string;
  contact?: string;
  signUpMethod: string;
  dob?: string;
  gender: string;
  interested?: string;
  highest_degree?: string;
  current_degree?: string;
  major?: string;
  profilePic?: string;
  alertsToggle: boolean;
  current_profession?: string;
  religion?: string;
  caste?: string;
  marital_status: string;
  kids?: string;
  number_of_kids: number;
  view_children: string;
  living_with: string;
  isDrink: string;
  isSmoke: string;
  isVerified: boolean;
  isOnline: boolean;
  country?: string;
  latitude?: number;
  longitude?: number;
  age?: number;
  height?: number;
  audio_url?: string;
  bio?: string;
  prompt?: string;
  gallery?: string;
  my_interests?: string;
  createdAt: string;
  updatedAt: string;
}

export const exportUsersToExcel = async (selectedUserIds?: string[]): Promise<void> => {
  try {
    // Fetch complete user data from backend
    const response = await api.get('/admin/user/getUsers', { 
      params: { 
        page: 1, 
        limit: 1000 // Get all users for export
      } 
    });
    
    const users: ExportUserData[] = response.data?.users || [];
    
    // Filter users if specific IDs are selected
    const usersToExport = selectedUserIds 
      ? users.filter(user => selectedUserIds.includes(String(user.id)))
      : users;

    if (usersToExport.length === 0) {
      throw new Error('No users found to export');
    }

    // Transform data for Excel export
    const excelData = usersToExport.map(user => ({
      'Account ID': user.id,
      'Full Name': user.fullName || 'N/A',
      'Email': user.email,
      'Contact': user.contact || 'N/A',
      'Sign Up Method': user.signUpMethod || 'N/A',
      'Date of Birth': user.dob || 'N/A',
      'Gender': user.gender || 'N/A',
      'Interested In': user.interested || 'N/A',
      'Highest Degree': user.highest_degree || 'N/A',
      'Current Degree': user.current_degree || 'N/A',
      'Major': Array.isArray(user.major) ? user.major.join(', ') : user.major || 'N/A',
      'Current Profession': Array.isArray(user.current_profession) 
        ? user.current_profession.join(', ') 
        : user.current_profession || 'N/A',
      'Religion': user.religion || 'N/A',
      'Caste': user.caste || 'N/A',
      'Marital Status': user.marital_status || 'N/A',
      'Has Kids': user.kids || 'N/A',
      'Number of Kids': user.number_of_kids || 0,
      'View Children': user.view_children || 'N/A',
      'Living With': user.living_with || 'N/A',
      'Drinks': user.isDrink || 'N/A',
      'Smokes': user.isSmoke || 'N/A',
      'Is Verified': user.isVerified ? 'Yes' : 'No',
      'Is Online': user.isOnline ? 'Yes' : 'No',
      'Country': user.country || 'N/A',
      'Age': user.age || 'N/A',
      'Height': user.height ? `${user.height} cm` : 'N/A',
      'Bio': user.bio || 'N/A',
      'My Interests': user.my_interests || 'N/A',
      'Account Created': new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      'Last Updated': new Date(user.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 10 }, // Account ID
      { wch: 20 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Contact
      { wch: 15 }, // Sign Up Method
      { wch: 12 }, // Date of Birth
      { wch: 8 },  // Gender
      { wch: 15 }, // Interested In
      { wch: 15 }, // Highest Degree
      { wch: 15 }, // Current Degree
      { wch: 20 }, // Major
      { wch: 20 }, // Current Profession
      { wch: 12 }, // Religion
      { wch: 12 }, // Caste
      { wch: 15 }, // Marital Status
      { wch: 10 }, // Has Kids
      { wch: 12 }, // Number of Kids
      { wch: 12 }, // View Children
      { wch: 12 }, // Living With
      { wch: 8 },  // Drinks
      { wch: 8 },  // Smokes
      { wch: 10 }, // Is Verified
      { wch: 10 }, // Is Online
      { wch: 15 }, // Country
      { wch: 5 },  // Age
      { wch: 10 }, // Height
      { wch: 30 }, // Bio
      { wch: 20 }, // My Interests
      { wch: 20 }, // Account Created
      { wch: 20 }  // Last Updated
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = selectedUserIds 
      ? `selected_users_export_${timestamp}.xlsx`
      : `all_users_export_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);

    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting users to Excel:', error);
    throw new Error('Failed to export users to Excel');
  }
};

export const exportEventsToExcel = async (selectedEventIds?: string[]): Promise<void> => {
  try {
    // Fetch complete event data from backend
    const response = await api.get('/host-event', { 
      params: { 
        page: 1, 
        limit: 1000 // Get all events for export
      } 
    });
    
    const events: ExportEventData[] = response.data?.events || [];
    
    // Filter events if specific IDs are selected
    const eventsToExport = selectedEventIds 
      ? events.filter(event => selectedEventIds.includes(String(event.id)))
      : events;

    if (eventsToExport.length === 0) {
      throw new Error('No events found to export');
    }

    // Transform data for Excel export
    const excelData = eventsToExport.map(event => ({
      'Event ID': event.id,
      'Event Name': event.eventName || 'N/A',
      'Event Type': event.eventType || 'N/A',
      'Description': event.description || 'N/A',
      'Location': event.location || 'N/A',
      'Repeat': event.repeat || 'N/A',
      'Date': event.date || 'N/A',
      'Time': event.time || 'N/A',
      'Created By ID': event.createdById || 'N/A',
      'Created At': new Date(event.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      'Last Updated': new Date(event.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 10 }, // Event ID
      { wch: 25 }, // Event Name
      { wch: 15 }, // Event Type
      { wch: 40 }, // Description
      { wch: 30 }, // Location
      { wch: 12 }, // Repeat
      { wch: 15 }, // Date
      { wch: 10 }, // Time
      { wch: 12 }, // Created By ID
      { wch: 20 }, // Created At
      { wch: 20 }  // Last Updated
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = selectedEventIds 
      ? `selected_events_export_${timestamp}.xlsx`
      : `all_events_export_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);

    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting events to Excel:', error);
    throw new Error('Failed to export events to Excel');
  }
};
