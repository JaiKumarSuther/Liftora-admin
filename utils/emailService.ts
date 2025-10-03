import { EmailNotification, UserAction } from '@/types';
import api from './apiClient';

/**
 * Email notification service for user management actions
 */
export class EmailService {
  /**
   * Send email notification to user
   */
  static async sendNotification(notification: EmailNotification): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with an email service like:
      // - SendGrid
      // - AWS SES
      // - Nodemailer with SMTP
      // - Resend
      
      console.log('📧 Sending email notification:', {
        to: notification.to,
        subject: notification.subject,
        actionType: notification.actionType
      });

      // Call backend email service using the configured API client
      const response = await api.post('/admin/send-email', notification);
      
      return response.data.status === true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Generate email content for user actions
   */
  static generateEmailContent(action: UserAction): EmailNotification {
    const baseSubject = action.emailSubject || this.getDefaultSubject(action.type);
    const baseMessage = action.emailMessage || this.getDefaultMessage(action.type, action.reason);

    return {
      to: '', // Will be populated by the calling function
      subject: baseSubject,
      message: baseMessage,
      actionType: action.type === 'ban' ? 'ban' : action.type === 'warning' ? 'warning' : 'status_change'
    };
  }

  /**
   * Get default email subject based on action type
   */
  private static getDefaultSubject(actionType: string): string {
    switch (actionType) {
      case 'ban':
        return 'Account Banned - Action Required';
      case 'warning':
        return 'Account Warning - Please Review';
      case 'activate':
        return 'Account Activated - Welcome Back';
      case 'deactivate':
        return 'Account Deactivated - Access Restricted';
      default:
        return 'Account Status Update';
    }
  }

  /**
   * Get default email message based on action type
   */
  private static getDefaultMessage(actionType: string, reason?: string): string {
    const reasonText = reason ? `\n\nReason: ${reason}` : '';
    
    switch (actionType) {
      case 'ban':
        return `Your account has been banned due to violation of our terms of service.${reasonText}\n\nIf you believe this is an error, please contact our support team.\n\nBest regards,\nThe Liftora Team`;
      case 'warning':
        return `You have received a warning for violating our community guidelines.${reasonText}\n\nPlease review our terms of service and ensure compliance to avoid further action.\n\nBest regards,\nThe Liftora Team`;
      case 'activate':
        return `Your account has been activated and you can now access all features.\n\nWelcome back!\n\nBest regards,\nThe Liftora Team`;
      case 'deactivate':
        return `Your account has been deactivated and access to the platform is now restricted.${reasonText}\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nThe Liftora Team`;
      default:
        return `Your account status has been updated.${reasonText}\n\nBest regards,\nThe Liftora Team`;
    }
  }
}

/**
 * Hook for handling user actions with email notifications
 */
export const useUserActions = () => {
  const performUserAction = async (action: UserAction, userEmail: string): Promise<boolean> => {
    try {
      // Generate email content
      const emailContent = EmailService.generateEmailContent(action);
      emailContent.to = userEmail;

      // Send email notification
      const emailSent = await EmailService.sendNotification(emailContent);
      
      if (!emailSent) {
        console.warn('Email notification failed, but action may still be processed');
      }

      // Here you would also update the user status in your database
      // This is just a placeholder for the actual implementation
      console.log('User action performed:', action);
      
      return true;
    } catch (error) {
      console.error('Failed to perform user action:', error);
      return false;
    }
  };

  return { performUserAction };
};
