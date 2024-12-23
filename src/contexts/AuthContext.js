import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(result.user, { displayName });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  async function updateEmail(email) {
    try {
      await updateFirebaseEmail(auth.currentUser, email);
    } catch (error) {
      throw error;
    }
  }

  async function updatePassword(password) {
    try {
      await updateFirebasePassword(auth.currentUser, password);
    } catch (error) {
      throw error;
    }
  }

  async function updateProfile(profile) {
    try {
      await updateFirebaseProfile(auth.currentUser, profile);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
