import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Flex,
  Heading,
  Link,
  Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const MotionBox = motion(Box);

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await resetPassword(email);
      toast({
        title: 'Success',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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
  }

  return (
    <Container maxW="container.xl" p={0}>
      <Flex h={{ base: 'auto', md: '100vh' }} py={[0, 10, 20]} direction={{ base: 'column-reverse', md: 'row' }}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            w="full"
          >
            <VStack spacing={8} w="full" maxW="md" mx="auto">
              <Heading>Reset Password</Heading>
              <Text textAlign="center">
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    isLoading={loading}
                  >
                    Reset Password
                  </Button>
                </VStack>
              </form>
              <Link href="/login" color="blue.500">
                Back to Login
              </Link>
            </VStack>
          </MotionBox>
        </VStack>
        <VStack
          w="full"
          h={{ base: '300px', md: '100vh' }}
          p={10}
          spacing={10}
          alignItems="center"
          bg="gray.50"
          position="relative"
          overflow="hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-4.0.3"
            alt="Reset Password illustration"
            objectFit="cover"
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            zIndex={0}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bg="blackAlpha.400"
            zIndex={1}
          />
        </VStack>
      </Flex>
    </Container>
  );
}
