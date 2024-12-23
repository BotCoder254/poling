import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  VStack,
  Heading,
  Container,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  HStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from './AuthLayout';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image="/images/auth-bg.jpg">
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} align="center">
            <Heading size="xl">Welcome Back</Heading>
            <Text color="gray.500">Sign in to continue to VoteSphere</Text>
          </VStack>

          <Button
            w="full"
            h="12"
            variant="outline"
            leftIcon={<FcGoogle />}
            onClick={handleGoogleSignIn}
            isLoading={loading}
          >
            Continue with Google
          </Button>

          <HStack>
            <Divider />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
              or sign in with email
            </Text>
            <Divider />
          </HStack>

          <VStack as="form" onSubmit={handleSubmit} spacing={4}>
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email address..."
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="************"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Link
              as={RouterLink}
              to="/reset-password"
              color="brand.500"
              alignSelf="flex-end"
              fontSize="sm"
            >
              Forgot Password?
            </Link>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              w="full"
              isLoading={loading}
              bgGradient="linear(to-r, brand.400, brand.600)"
              _hover={{
                bgGradient: "linear(to-r, brand.500, brand.700)",
              }}
            >
              Sign In
            </Button>

            <Text textAlign="center">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/signup" color="brand.500">
                Sign up →
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </AuthLayout>
  );
}
