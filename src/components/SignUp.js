import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link,
  VStack,
  Heading,
  Container,
  Checkbox,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const brandColor = useColorModeValue('brand.500', 'brand.300');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }
    if (!agreeToTerms) newErrors.terms = 'You must agree to the Terms of Use';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signup(formData.email, formData.password, formData.fullName);
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
    <Box minH="100vh" py={10} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.md">
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          w="full"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="xl">Sign Up</Heading>

            <VStack as="form" onSubmit={handleSubmit} spacing={4}>
              <FormControl isInvalid={errors.fullName}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="Name..."
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                <FormErrorMessage>{errors.fullName}</FormErrorMessage>
              </FormControl>

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

              <FormControl isInvalid={errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="Username..."
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
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

              <FormControl isInvalid={errors.repeatPassword}>
                <FormLabel>Repeat Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="************"
                    value={formData.repeatPassword}
                    onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showRepeatPassword ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      aria-label={showRepeatPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.repeatPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.terms}>
                <Checkbox
                  isChecked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                >
                  I agree to the <Link color={brandColor} href="#">Terms of User</Link>
                </Checkbox>
                <FormErrorMessage>{errors.terms}</FormErrorMessage>
              </FormControl>

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
                Sign Up
              </Button>

              <Text textAlign="center">
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color={brandColor}>
                  Sign in →
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
