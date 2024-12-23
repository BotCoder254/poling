import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  useToast,
  Card,
  CardBody,
  Text,
  Divider,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile, updateEmail, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      return toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      const promises = [];

      if (displayName !== currentUser.displayName) {
        promises.push(updateProfile({ displayName }));
      }

      if (email !== currentUser.email) {
        promises.push(updateEmail(email));
      }

      if (password) {
        promises.push(updatePassword(password));
      }

      await Promise.all(promises);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Card w="full" bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="center">
              <Avatar
                size="2xl"
                name={currentUser.displayName || currentUser.email}
                src={currentUser.photoURL}
              />
              <VStack spacing={1}>
                <Heading size="md">
                  {currentUser.displayName || 'User'}
                </Heading>
                <Text color="gray.500">{currentUser.email}</Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        <Card w="full" bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack as="form" onSubmit={handleSubmit} spacing={6}>
              <Heading size="md" alignSelf="start">Edit Profile</Heading>
              
              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <Divider />

              <Heading size="md" alignSelf="start">Change Password</Heading>

              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                isLoading={loading}
                alignSelf="start"
              >
                Save Changes
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
