import React from 'react';
import {
  Box,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';

export default function AuthLayout({ children, image }) {
  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
      {/* Form Side */}
      <Box
        flex="1"
        bg={useColorModeValue('white', 'gray.800')}
        p={{ base: 8, lg: 16 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Box>

      {/* Image Side */}
      <Box
        flex="1"
        display={{ base: 'none', md: 'block' }}
        position="relative"
        overflow="hidden"
      >
        <Image
          src={image}
          alt="Auth background"
          objectFit="cover"
          w="full"
          h="full"
          position="absolute"
          top="0"
          left="0"
          filter="brightness(0.7)"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-r, brand.400, brand.600)"
          opacity="0.4"
        />
      </Box>
    </Flex>
  );
}
