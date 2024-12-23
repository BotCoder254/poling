import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Link,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const SocialButton = ({ icon, label, href }) => {
  return (
    <Link
      href={href}
      isExternal
      _hover={{
        textDecoration: 'none',
        color: useColorModeValue('blue.500', 'blue.300'),
      }}
      aria-label={label}
    >
      <Icon as={icon} w={6} h={6} />
    </Link>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        spacing={4}
        justify={'center'}
        align={'center'}
      >
        <HStack spacing={6}>
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Link as={RouterLink} to="/about" _hover={{ textDecoration: 'none' }}>
            About
          </Link>
          <Link href="#" isExternal _hover={{ textDecoration: 'none' }}>
            Contact
          </Link>
        </HStack>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Twitter'}
            href={'#'}
            icon={FaTwitter}
          />
          <SocialButton
            label={'GitHub'}
            href={'#'}
            icon={FaGithub}
          />
          <SocialButton
            label={'LinkedIn'}
            href={'#'}
            icon={FaLinkedin}
          />
        </Stack>
        <Text> 2024 VoteSphere. All rights reserved</Text>
      </Container>
    </Box>
  );
}
