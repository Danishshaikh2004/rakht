/**
 * Email Service
 * Handles OTP sending and verification via email
 */

import otpGenerator from '../utils/otpGenerator';

class EmailService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api'; // Replace with your actual API endpoint
    this.isDevelopment = true; // Set to false in production
  }

  /**
   * Send OTP to email
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Response object
   */
  async sendOTP(email) {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.'
        };
      }

      // Generate OTP
      const otp = otpGenerator.generateOTP();

      if (this.isDevelopment) {
        // Development mode: Store OTP locally and simulate email sending
        otpGenerator.storeOTP(email, otp);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`📧 Development Mode: OTP for ${email} is ${otp}`);

        return {
          success: true,
          message: 'OTP sent successfully! Check console for development OTP.',
          otp: otp // Only for development
        };
      } else {
        // Production mode: Send actual email via API
        const response = await fetch(`${this.baseURL}/auth/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp })
        });

        const result = await response.json();

        if (response.ok) {
          otpGenerator.storeOTP(email, otp);
          return {
            success: true,
            message: 'OTP sent successfully to your email!'
          };
        } else {
          return {
            success: false,
            message: result.message || 'Failed to send OTP. Please try again.'
          };
        }
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  /**
   * Verify OTP for email
   * @param {string} email - User's email address
   * @param {string} otp - User input OTP
   * @returns {Promise<Object>} Verification result
   */
  async verifyOTP(email, otp) {
    try {
      // Use the OTP generator to verify
      const result = otpGenerator.verifyOTP(email, otp);

      if (this.isDevelopment) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Production mode: Verify via API
        const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp })
        });

        const apiResult = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: apiResult.message || 'OTP verification failed.'
          };
        }
      }

      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Resend OTP to email
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Response object
   */
  async resendOTP(email) {
    try {
      const result = await this.sendOTP(email);

      if (result.success) {
        return {
          success: true,
          message: 'OTP resent successfully!'
        };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      };
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if email has valid OTP
   * @param {string} email - User's email address
   * @returns {boolean} Has valid OTP
   */
  hasValidOTP(email) {
    return otpGenerator.hasValidOTP(email);
  }

  /**
   * Get remaining time for OTP
   * @param {string} email - User's email address
   * @returns {number} Remaining seconds
   */
  getRemainingTime(email) {
    return otpGenerator.getRemainingTime(email);
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;
