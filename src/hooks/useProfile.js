import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function useProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create initial profile
        const initialProfile = {
          profile: {
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            bio: '',
            location: '',
            createdAt: new Date(),
          },
        };
        await setDoc(userDocRef, initialProfile);
        setProfile(initialProfile.profile);
      } else {
        const userData = userDoc.data();
        setProfile(userData.profile || {});
      }
    } catch (error) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePhoto = async (file) => {
    try {
      setLoading(true);
      const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      await Promise.all([
        updateProfile(currentUser, { photoURL }),
        updateDoc(doc(db, 'users', currentUser.uid), {
          'profile.photoURL': photoURL,
        }),
      ]);

      setProfile((prev) => ({ ...prev, photoURL }));
      toast({
        title: 'Profile photo updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile photo',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfileInfo = async (newProfile) => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      await Promise.all([
        updateProfile(currentUser, {
          displayName: newProfile.displayName,
        }),
        updateDoc(userDocRef, {
          profile: newProfile,
        }),
      ]);

      setProfile(newProfile);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    updateProfilePhoto,
    updateProfileInfo,
  };
}
