import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBarChart2, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';

const StatCard = ({ icon, label, number, helpText }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={5}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <Stat>
        <StatLabel fontSize="sm" color="gray.500" mb={1}>
          <Icon as={icon} mr={2} />
          {label}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {number}
        </StatNumber>
        <StatHelpText>{helpText}</StatHelpText>
      </Stat>
    </Box>
  );
};

export default function PollStats({ createdPolls, participatedPolls }) {
  const activePolls = createdPolls.filter(poll => poll.status === 'active').length;
  const totalVotes = createdPolls.reduce((acc, poll) => acc + (poll.totalVotes || 0), 0);
  const avgVotesPerPoll = createdPolls.length > 0
    ? Math.round(totalVotes / createdPolls.length)
    : 0;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
      <StatCard
        icon={FiBarChart2}
        label="Total Polls"
        number={createdPolls.length}
        helpText="Polls you've created"
      />
      <StatCard
        icon={FiUsers}
        label="Total Votes"
        number={totalVotes}
        helpText={`${avgVotesPerPoll} votes per poll`}
      />
      <StatCard
        icon={FiCheckCircle}
        label="Active Polls"
        number={activePolls}
        helpText="Currently running"
      />
      <StatCard
        icon={FiClock}
        label="Participated"
        number={participatedPolls.length}
        helpText="Polls you've voted in"
      />
    </SimpleGrid>
  );
}
