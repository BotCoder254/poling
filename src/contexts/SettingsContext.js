import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'en',
    emailNotifications: true,
    defaultPollDuration: '7days',
    privatePolls: false,
    showVoteCount: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserSettings();
    } else {
      setSettings({
        theme: 'system',
        language: 'en',
        emailNotifications: true,
        defaultPollDuration: '7days',
        privatePolls: false,
        showVoteCount: true,
      });
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserSettings = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create initial settings document
        const initialSettings = {
          settings: {
            theme: 'system',
            language: 'en',
            emailNotifications: true,
            defaultPollDuration: '7days',
            privatePolls: false,
            showVoteCount: true,
          },
          createdAt: new Date(),
        };
        await setDoc(userDocRef, initialSettings);
        setSettings(initialSettings.settings);
      } else {
        const userData = userDoc.data();
        setSettings(userData.settings || {});
      }
    } catch (error) {
      toast({
        title: 'Error loading settings',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      if (!currentUser) return;

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { settings: newSettings }, { merge: true });
      setSettings(newSettings);

      toast({
        title: 'Settings updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating settings',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const value = {
    settings,
    updateSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
