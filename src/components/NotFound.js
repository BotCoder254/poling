import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)">
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading
            size="4xl"
            bgGradient="linear(to-r, brand.500, brand.800)"
            bgClip="text"
          >
            404
          </Heading>
          <Heading size="xl">Page Not Found</Heading>
          <Text color="gray.500">
            The page you're looking for doesn't seem to exist
          </Text>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="brand"
            size="lg"
          >
            Return Home
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
