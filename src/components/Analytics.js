import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { useUserPolls } from '../hooks/useUserPolls';
import { useAuth } from '../contexts/AuthContext';

export default function Analytics() {
  const { currentUser } = useAuth();
  const { createdPolls, participatedPolls } = useUserPolls(currentUser?.uid);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const totalVotes = createdPolls.reduce((acc, poll) => acc + (poll.totalVotes || 0), 0);
  const activePolls = createdPolls.filter(poll => poll.status === 'active').length;
  const avgVotesPerPoll = createdPolls.length > 0
    ? Math.round(totalVotes / createdPolls.length)
    : 0;

  const stats = [
    {
      label: 'Total Polls Created',
      number: createdPolls.length,
      helpText: 'All time',
    },
    {
      label: 'Total Votes Received',
      number: totalVotes,
      helpText: `${avgVotesPerPoll} votes per poll`,
    },
    {
      label: 'Active Polls',
      number: activePolls,
      helpText: 'Currently running',
    },
    {
      label: 'Polls Participated',
      number: participatedPolls.length,
      helpText: "Polls you have voted in",
    },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Analytics</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {stats.map((stat, index) => (
          <Card key={index} bg={bgColor} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="gray.500">
                  {stat.label}
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold">
                  {stat.number}
                </StatNumber>
                <StatHelpText>{stat.helpText}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
