import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { getPollById } from '../utils/shareUtils';
import PollCard from './PollCard';

export default function SharedPoll() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPollById(pollId);
        setPoll(pollData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading poll...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Heading size="lg" textAlign="center">
            Shared Poll
          </Heading>
          {poll && <PollCard poll={poll} />}
        </VStack>
      </Container>
    </Box>
  );
}
