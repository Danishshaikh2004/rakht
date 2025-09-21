/**
 * OTP Generator Utility
 * Handles OTP generation, storage, and verification
 */

class OTPGenerator {
  constructor() {
    this.otpStorage = new Map(); // In production, use Redis or database
  }

  /**
   * Generate a 6-digit OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP with expiration
   * @param {string} email - User's email
   * @param {string} otp - Generated OTP
   * @param {number} expirationMinutes - Minutes until expiration (default: 5)
   * @returns {boolean} Success status
   */
  storeOTP(email, otp, expirationMinutes = 5) {
    const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);

    this.otpStorage.set(email, {
      otp,
      expirationTime,
      attempts: 0
    });

    return true;
  }

  /**
   * Verify OTP for email
   * @param {string} email - User's email
   * @param {string} inputOTP - User input OTP
   * @returns {Object} Verification result
   */
  verifyOTP(email, inputOTP) {
    const storedData = this.otpStorage.get(email);

    if (!storedData) {
      return {
        success: false,
        message: 'No OTP found for this email. Please request a new OTP.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expirationTime) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      };
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      this.otpStorage.delete(email);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      };
    }

    // Verify OTP
    if (storedData.otp === inputOTP) {
      this.otpStorage.delete(email); // Clean up after successful verification
      return {
        success: true,
        message: 'OTP verified successfully!'
      };
    } else {
      // Increment attempts
      storedData.attempts += 1;
      this.otpStorage.set(email, storedData);

      const remainingAttempts = 3 - storedData.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      };
    }
  }

  /**
   * Check if email has a valid OTP
   * @param {string} email - User's email
   * @returns {boolean} Has valid OTP
   */
  hasValidOTP(email) {
    const storedData = this.otpStorage.get(email);

    if (!storedData) {
      return false;
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expirationTime) {
      this.otpStorage.delete(email);
      return false;
    }

    return true;
  }

  /**
   * Get remaining time for OTP
   * @param {string} email - User's email
   * @returns {number} Remaining seconds
   */
  getRemainingTime(email) {
    const storedData = this.otpStorage.get(email);

    if (!storedData) {
      return 0;
    }

    const remaining = Math.max(0, storedData.expirationTime - Date.now());
    return Math.floor(remaining / 1000);
  }

  /**
   * Resend OTP for email
   * @param {string} email - User's email
   * @returns {string} New OTP
   */
  resendOTP(email) {
    const newOTP = this.generateOTP();
    this.storeOTP(email, newOTP);
    return newOTP;
  }

  /**
   * Clean up expired OTPs (call periodically)
   */
  cleanup() {
    const now = Date.now();
    for (const [email, data] of this.otpStorage.entries()) {
      if (now > data.expirationTime) {
        this.otpStorage.delete(email);
      }
    }
  }
}

// Create singleton instance
const otpGenerator = new OTPGenerator();

// Clean up expired OTPs every minute
setInterval(() => {
  otpGenerator.cleanup();
}, 60000);

export default otpGenerator;
