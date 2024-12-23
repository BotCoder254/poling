import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Divider,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  LineChart,
  BarChart,
  Tooltip,
  List,
  ListItem,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { FiShare2, FiBarChart2, FiUsers, FiClock, FiThumbsUp } from 'react-icons/fi';
import { format, formatDistance } from 'date-fns';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const PollDetails = ({ poll, isOpen, onClose, onVote }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Calculate various statistics
  const totalVotes = poll.voters?.length || 0;
  const totalViews = poll.views || 0;
  const engagementRate = totalVotes > 0 ? ((totalVotes / totalViews) * 100).toFixed(1) : 0;
  const votingHistory = poll.votingHistory || [];

  // Prepare data for voting trends chart
  const votingTrendsData = {
    labels: votingHistory.map(record => format(new Date(record.timestamp), 'MMM d')),
    datasets: [{
      label: 'Votes',
      data: votingHistory.map(record => record.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Prepare data for options distribution chart
  const optionsData = {
    labels: poll.options.map(opt => opt.text),
    datasets: [{
      label: 'Votes',
      data: poll.options.map(opt => opt.votes),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
    }]
  };

  // Calculate time-based statistics
  const timeActive = formatDistance(
    new Date(poll.createdAt?.seconds * 1000),
    new Date(),
    { addSuffix: true }
  );

  const votesPerDay = totalVotes / (
    (Date.now() - new Date(poll.createdAt?.seconds * 1000).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="2xl">{poll.title}</Text>
          <HStack spacing={2} mt={2}>
            <Badge colorScheme={poll.status === 'active' ? 'green' : 'purple'}>
              {poll.status}
            </Badge>
            {poll.isPrivate && <Badge colorScheme="blue">Private</Badge>}
            {poll.multipleChoice && <Badge colorScheme="orange">Multiple Choice</Badge>}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Overview</Tab>
              <Tab>Analytics</Tab>
              <Tab>Engagement</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {poll.description && (
                    <Box>
                      <Text fontSize="md" color="gray.600">
                        {poll.description}
                      </Text>
                    </Box>
                  )}

                  {poll.mediaUrls && poll.mediaUrls.length > 0 && (
                    <SimpleGrid columns={[1, Math.min(poll.mediaUrls.length, 2)]} spacing={4}>
                      {poll.mediaUrls.map((url, index) => (
                        <Box
                          key={index}
                          position="relative"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Image
                            src={url}
                            alt={`Poll image ${index + 1}`}
                            width="100%"
                            height="200px"
                            objectFit="cover"
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={4}>Current Results</Text>
                    <VStack spacing={4} align="stretch">
                      {poll.options.map((option, index) => {
                        const percentage = totalVotes === 0 ? 0 : 
                          ((option.votes / totalVotes) * 100).toFixed(1);
                        return (
                          <Box key={index}>
                            <HStack justify="space-between" mb={1}>
                              <Text>{option.text}</Text>
                              <Text fontWeight="bold">{percentage}%</Text>
                            </HStack>
                            <Progress
                              value={percentage}
                              colorScheme="blue"
                              size="sm"
                              borderRadius="full"
                            />
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              {option.votes} vote{option.votes !== 1 ? 's' : ''}
                            </Text>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={[2, 4]} spacing={4}>
                    <Stat>
                      <StatLabel>Total Votes</StatLabel>
                      <StatNumber>{totalVotes}</StatNumber>
                      <StatHelpText>{votesPerDay.toFixed(1)} votes/day</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Views</StatLabel>
                      <StatNumber>{totalViews}</StatNumber>
                      <StatHelpText>{engagementRate}% engagement</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Time Active</StatLabel>
                      <StatNumber>{timeActive}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Unique Voters</StatLabel>
                      <StatNumber>{poll.voters?.length || 0}</StatNumber>
                    </Stat>
                  </SimpleGrid>

                  <Box p={4} borderRadius="lg" borderWidth="1px">
                    <Text fontWeight="bold" mb={4}>Voting Trends</Text>
                    <Box height="200px">
                      <Chart type="line" data={votingTrendsData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }} />
                    </Box>
                  </Box>

                  <Box p={4} borderRadius="lg" borderWidth="1px">
                    <Text fontWeight="bold" mb={4}>Vote Distribution</Text>
                    <Box height="200px">
                      <Chart type="bar" data={optionsData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: false,
                          },
                        },
                      }} />
                    </Box>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={4}>Recent Voters</Text>
                    <List spacing={3}>
                      {poll.recentVoters?.map((voter, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <Avatar size="sm" name={voter.name} src={voter.photoURL} />
                            <Box>
                              <Text fontWeight="medium">{voter.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                Voted {formatDistance(
                                  new Date(voter.timestamp?.seconds * 1000),
                                  new Date(),
                                  { addSuffix: true }
                                )}
                              </Text>
                            </Box>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={4}>Engagement Metrics</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box p={4} borderRadius="lg" borderWidth="1px">
                        <VStack>
                          <FiUsers size={24} />
                          <StatLabel>Peak Voting Time</StatLabel>
                          <StatNumber>2-4 PM</StatNumber>
                        </VStack>
                      </Box>
                      <Box p={4} borderRadius="lg" borderWidth="1px">
                        <VStack>
                          <FiBarChart2 size={24} />
                          <StatLabel>Most Active Day</StatLabel>
                          <StatNumber>Wednesday</StatNumber>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={4}>
            <Button
              leftIcon={<FiShare2 />}
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: 'Link copied',
                  status: 'success',
                  duration: 2000,
                });
              }}
            >
              Share
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PollDetails;
