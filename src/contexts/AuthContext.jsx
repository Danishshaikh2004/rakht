import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { DatabaseService } from '../services/databaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user profile from Firestore
        const result = await DatabaseService.getUserProfile(user.uid);
        if (result.success) {
          setUserProfile(result.data);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    // Auth methods
    register: AuthService.registerUser,
    login: AuthService.loginUser,
    logout: AuthService.logoutUser,
    signInWithGoogle: AuthService.signInWithGoogle,
    sendPasswordReset: AuthService.sendPasswordReset,
    // Database methods
    updateUserProfile: DatabaseService.updateUserProfile,
    updateLastDonation: DatabaseService.updateLastDonation,
    saveDonation: DatabaseService.saveDonation,
    saveBloodRequest: DatabaseService.saveBloodRequest,
    updateUserProfileWithRequest: DatabaseService.updateUserProfileWithRequest
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
