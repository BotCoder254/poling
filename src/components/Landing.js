import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  SimpleGrid,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiUsers,
  FiLock,
  FiTrendingUp,
  FiPieChart,
  FiGlobe,
} from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align="center" textAlign="center">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="brand.500"
        mb={1}
      >
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color="gray.600">{text}</Text>
    </Stack>
  );
};

const Statistic = ({ number, label }) => {
  return (
    <VStack>
      <Text fontSize="4xl" fontWeight="bold" color="brand.500">
        {number}
      </Text>
      <Text color="gray.600">{label}</Text>
    </VStack>
  );
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" py={{ base: 20, md: 28 }}>
          <Stack
            align="center"
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text as="span">Create and Share</Text>
                <br />
                <Text as="span" color="brand.500">
                  Polls Instantly
                </Text>
              </Heading>
              <Text color="gray.500" fontSize="xl">
                VoteSphere makes it easy to create, share, and analyze polls.
                Get instant feedback from your audience and make data-driven decisions.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  rounded="full"
                  size="lg"
                  fontWeight="normal"
                  px={6}
                  colorScheme="brand"
                  bg="brand.500"
                  _hover={{ bg: 'brand.600' }}
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
                <Button
                  rounded="full"
                  size="lg"
                  fontWeight="normal"
                  px={6}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify="center"
              align="center"
              position="relative"
              w="full"
            >
              <Image
                alt="Hero Image"
                fit="cover"
                align="center"
                w="100%"
                h="100%"
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
              />
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
            <Statistic number="10K+" label="Active Users" />
            <Statistic number="50K+" label="Polls Created" />
            <Statistic number="1M+" label="Votes Cast" />
            <Statistic number="95%" label="Satisfaction Rate" />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading>Everything You Need</Heading>
              <Text color="gray.500" maxW="2xl">
                Create polls, gather responses, and analyze results with our comprehensive suite of features.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              <Feature
                icon={FiBarChart2}
                title="Real-time Analytics"
                text="Get instant insights with live vote tracking and detailed analytics."
              />
              <Feature
                icon={FiUsers}
                title="Easy Sharing"
                text="Share your polls with anyone through a simple link or embed them."
              />
              <Feature
                icon={FiLock}
                title="Secure & Private"
                text="Control who can vote with advanced privacy settings and authentication."
              />
              <Feature
                icon={FiTrendingUp}
                title="Trend Analysis"
                text="Track voting patterns and analyze trends over time."
              />
              <Feature
                icon={FiPieChart}
                title="Visual Results"
                text="Display results in beautiful charts and graphs."
              />
              <Feature
                icon={FiGlobe}
                title="Global Reach"
                text="Create polls that can be accessed from anywhere in the world."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading>How It Works</Heading>
              <Text color="gray.500" maxW="2xl">
                Create and share polls in just three simple steps.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <VStack>
                <Image
                  rounded="lg"
                  shadow="2xl"
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                  alt="Create Poll"
                />
                <Heading size="md">1. Create Poll</Heading>
                <Text color="gray.500" textAlign="center">
                  Design your poll with our intuitive interface.
                </Text>
              </VStack>
              <VStack>
                <Image
                  rounded="lg"
                  shadow="2xl"
                  src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                  alt="Share Poll"
                />
                <Heading size="md">2. Share Poll</Heading>
                <Text color="gray.500" textAlign="center">
                  Share your poll with your audience.
                </Text>
              </VStack>
              <VStack>
                <Image
                  rounded="lg"
                  shadow="2xl"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                  alt="Analyze Results"
                />
                <Heading size="md">3. Analyze Results</Heading>
                <Text color="gray.500" textAlign="center">
                  Get insights from real-time analytics.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg={useColorModeValue('brand.50', 'gray.900')}>
        <Container maxW="7xl">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={10}
            align="center"
            justify="space-between"
            bg={useColorModeValue('white', 'gray.800')}
            p={10}
            rounded="xl"
            shadow="xl"
          >
            <VStack align="flex-start" spacing={4} maxW="2xl">
              <Heading size="lg">Ready to Get Started?</Heading>
              <Text color="gray.500">
                Join thousands of users who are already making better decisions with VoteSphere.
              </Text>
            </VStack>
            <Button
              size="lg"
              colorScheme="brand"
              px={8}
              onClick={() => navigate('/signup')}
            >
              Create Your First Poll
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
