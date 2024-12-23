import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import PollCard from './PollCard';
import { useFeaturedPolls } from '../hooks/useFeaturedPolls';

const Featured = () => {
  const { featuredPolls, loading, error } = useFeaturedPolls();

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" />
          <Text>Loading featured polls...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text color="red.500">Error loading featured polls: {error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Featured Polls</Heading>
        {featuredPolls.length === 0 ? (
          <Text>No featured polls available at the moment.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {featuredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                showActions={false}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default Featured;
