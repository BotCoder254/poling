import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useToast,
  Card,
  CardBody,
  Text,
  Divider,
  useColorModeValue,
  Select,
  Input,
  Avatar,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { FiCamera, FiEye, FiEyeOff } from 'react-icons/fi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function Settings() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
    bio: '',
    location: '',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    defaultPollDuration: '7days',
    privatePolls: false,
    showVoteCount: true,
    theme: 'system',
    language: 'en',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchUserSettings();
  }, [currentUser]);

  const fetchUserSettings = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create initial user document if it doesn't exist
        const initialUserData = {
          profile: {
            displayName: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            bio: '',
            location: '',
          },
          settings: {
            emailNotifications: true,
            defaultPollDuration: '7days',
            privatePolls: false,
            showVoteCount: true,
            theme: 'system',
            language: 'en',
          },
          createdAt: new Date(),
        };
        await setDoc(userDocRef, initialUserData);
        setUserProfile(initialUserData.profile);
        setSettings(initialUserData.settings);
      } else {
        const userData = userDoc.data();
        setSettings(prevSettings => ({
          ...prevSettings,
          ...userData.settings,
        }));
        setUserProfile(prevProfile => ({
          ...prevProfile,
          ...userData.profile,
        }));
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast({
        title: 'Error loading settings',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

      setUserProfile(prev => ({ ...prev, photoURL }));
      toast({
        title: 'Profile photo updated',
        status: 'success',
        duration: 3000,
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

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      await Promise.all([
        updateProfile(currentUser, {
          displayName: userProfile.displayName,
        }),
        updateDoc(userDocRef, {
          profile: userProfile,
        }),
      ]);

      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
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

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwords.current
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwords.new);

      toast({
        title: 'Password updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast({
        title: 'Error updating password',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        settings: settings,
      });

      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Profile Settings</Heading>

              <HStack spacing={4} align="center">
                <Avatar
                  size="xl"
                  src={userProfile.photoURL}
                  name={userProfile.displayName}
                />
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-photo"
                    style={{ display: 'none' }}
                    onChange={handleProfilePhotoChange}
                  />
                  <Button
                    leftIcon={<FiCamera />}
                    onClick={() => document.getElementById('profile-photo').click()}
                    size="sm"
                  >
                    Change Photo
                  </Button>
                </Box>
              </HStack>

              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input
                  value={userProfile.displayName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, displayName: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input
                  value={userProfile.bio}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, bio: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={userProfile.location}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, location: e.target.value })
                  }
                />
              </FormControl>

              <Button
                colorScheme="blue"
                isLoading={loading}
                onClick={handleProfileUpdate}
              >
                Update Profile
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Security Settings</Heading>

              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPasswords.current ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPasswords.new ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                colorScheme="blue"
                isLoading={loading}
                onClick={handlePasswordChange}
              >
                Update Password
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Poll Settings</Heading>

              <FormControl>
                <FormLabel>Default Poll Duration</FormLabel>
                <Select
                  value={settings.defaultPollDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultPollDuration: e.target.value,
                    })
                  }
                >
                  <option value="1day">1 Day</option>
                  <option value="3days">3 Days</option>
                  <option value="7days">1 Week</option>
                  <option value="30days">30 Days</option>
                  <option value="never">No Expiration</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Theme</FormLabel>
                <Select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: e.target.value,
                    })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      language: e.target.value,
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </Select>
              </FormControl>

              <Divider />

              <FormControl display="flex" alignItems="center">
                <Switch
                  id="email-notifications"
                  isChecked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  mr={3}
                />
                <FormLabel htmlFor="email-notifications" mb={0}>
                  Email Notifications
                </FormLabel>
              </FormControl>

              <Text fontSize="sm" color="gray.500">
                Receive email notifications when someone votes on your polls
              </Text>

              <FormControl display="flex" alignItems="center">
                <Switch
                  id="private-polls"
                  isChecked={settings.privatePolls}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privatePolls: e.target.checked,
                    })
                  }
                  mr={3}
                />
                <FormLabel htmlFor="private-polls" mb={0}>
                  Make new polls private by default
                </FormLabel>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <Switch
                  id="show-vote-count"
                  isChecked={settings.showVoteCount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showVoteCount: e.target.checked,
                    })
                  }
                  mr={3}
                />
                <FormLabel htmlFor="show-vote-count" mb={0}>
                  Show vote count while poll is active
                </FormLabel>
              </FormControl>

              <Button
                colorScheme="blue"
                isLoading={loading}
                onClick={handleSettingsSave}
              >
                Save Settings
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
