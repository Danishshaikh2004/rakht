import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './firebase';

export class DatabaseService {
  // Get user profile data
  static async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  static async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = [];
      usersSnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search users by blood group
  static async searchUsersByBloodGroup(bloodGroup) {
    try {
      const q = query(collection(db, 'users'), where('bloodGroup', '==', bloodGroup));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search users by location
  static async searchUsersByLocation(location) {
    try {
      const q = query(collection(db, 'users'), where('location', '==', location));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Real-time listener for user data
  static listenToUserProfile(uid, callback) {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        callback({ success: true, data: doc.data() });
      } else {
        callback({ success: false, error: 'User not found' });
      }
    });
  }

  // Update last donation date
  static async updateLastDonation(uid, donationDate) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastDonation: donationDate,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Upload file to Firebase Storage
  static async uploadFile(file, userId, fileType) {
    try {
      if (!file) return { success: true, data: null };

      const timestamp = Date.now();
      const fileName = `${userId}_${fileType}_${timestamp}_${file.name}`;
      const storageRef = ref(storage, `blood_requests/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return { success: true, data: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save donation request
  static async saveDonation(donationData) {
    try {
      const donationId = `${donationData.userId}_${Date.now()}`;

      await setDoc(doc(db, 'donations', donationId), {
        ...donationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { success: true, data: donationId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save blood request with file uploads (Firebase Storage or Base64 fallback)
  static async saveBloodRequest(requestData, files = {}) {
    try {
      const requestId = `${requestData.userId}_${Date.now()}`;

      // Upload files if provided - try Firebase Storage first, fallback to base64
      const fileUploads = {};

      // Handle prescription file
      if (files.prescription) {
        try {
          const prescriptionResult = await this.uploadFile(files.prescription, requestData.userId, 'prescription');
          if (prescriptionResult.success) {
            fileUploads.prescriptionUrl = prescriptionResult.data;
          } else {
            // Fallback to base64 encoding
            fileUploads.prescriptionBase64 = await this.fileToBase64(files.prescription);
            fileUploads.prescriptionName = files.prescription.name;
          }
        } catch (error) {
          // Fallback to base64 encoding
          fileUploads.prescriptionBase64 = await this.fileToBase64(files.prescription);
          fileUploads.prescriptionName = files.prescription.name;
        }
      }

      // Handle hospital report file
      if (files.hospitalReport) {
        try {
          const reportResult = await this.uploadFile(files.hospitalReport, requestData.userId, 'hospital_report');
          if (reportResult.success) {
            fileUploads.hospitalReportUrl = reportResult.data;
          } else {
            // Fallback to base64 encoding
            fileUploads.hospitalReportBase64 = await this.fileToBase64(files.hospitalReport);
            fileUploads.hospitalReportName = files.hospitalReport.name;
          }
        } catch (error) {
          // Fallback to base64 encoding
          fileUploads.hospitalReportBase64 = await this.fileToBase64(files.hospitalReport);
          fileUploads.hospitalReportName = files.hospitalReport.name;
        }
      }

      // Save request data to Firestore
      await setDoc(doc(db, 'blood_requests', requestId), {
        ...requestData,
        ...fileUploads,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { success: true, data: requestId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update user profile with request information
  static async updateUserProfileWithRequest(uid, requestData) {
    try {
      const updates = {
        lastRequestDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add request-specific fields if provided
      if (requestData.bloodGroup) {
        updates.lastRequestedBloodGroup = requestData.bloodGroup;
      }

      await updateDoc(doc(db, 'users', uid), updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Convert file to base64
  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
