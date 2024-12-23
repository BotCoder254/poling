import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  useDisclosure,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Flex,
  Spacer,
  Select,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';
import { FiPlus, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import PollCard from './PollCard';
import CreatePollModal from './CreatePollModal';
import { useAuth } from '../contexts/AuthContext';
import { useUserPolls } from '../hooks/useUserPolls';
import LiquidLoader from './LiquidLoader';
import Pagination from './Pagination';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  const { createdPolls, participatedPolls, loading, error } = useUserPolls(currentUser?.uid);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Combine created and participated polls
    const allPolls = [...createdPolls, ...participatedPolls];
    
    let result = allPolls;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        poll =>
          poll.title.toLowerCase().includes(query) ||
          poll.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(poll => poll.status === filterStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt?.seconds - a.createdAt?.seconds;
        case 'oldest':
          return a.createdAt?.seconds - b.createdAt?.seconds;
        case 'mostVotes':
          return (b.voters?.length || 0) - (a.voters?.length || 0);
        case 'leastVotes':
          return (a.voters?.length || 0) - (b.voters?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredPolls(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [createdPolls, participatedPolls, searchQuery, filterStatus, sortBy]);

  // Pagination calculations
  const totalItems = filteredPolls.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPolls = filteredPolls.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setSortBy('newest');
  };

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={8}>
          <Text color="red.500">Error loading polls: {error.message}</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            align={{ base: 'stretch', md: 'center' }}
          >
            <Heading size="lg">Your Polls</Heading>
            <Spacer />
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
              size="md"
            >
              Create New Poll
            </Button>
          </Flex>

          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              align={{ base: 'stretch', md: 'center' }}
            >
              <InputGroup maxW={{ base: '100%', md: '300px' }}>
                <Input
                  placeholder="Search polls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      icon={<FiX />}
                      variant="ghost"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    />
                  </InputRightElement>
                )}
              </InputGroup>

              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                maxW={{ base: '100%', md: '200px' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="expired">Expired</option>
              </Select>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                maxW={{ base: '100%', md: '200px' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostVotes">Most Votes</option>
                <option value="leastVotes">Least Votes</option>
              </Select>

              {(searchQuery || filterStatus !== 'all' || sortBy !== 'newest') && (
                <Button
                  leftIcon={<FiX />}
                  variant="ghost"
                  onClick={clearFilters}
                  size="md"
                >
                  Clear Filters
                </Button>
              )}
            </Flex>
          </Box>

          {loading ? (
            <Box py={10} textAlign="center">
              <LiquidLoader />
            </Box>
          ) : currentPolls.length === 0 ? (
            <Box
              p={8}
              textAlign="center"
              bg={cardBg}
              borderRadius="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Text fontSize="lg" mb={4}>
                {searchQuery || filterStatus !== 'all'
                  ? 'No polls match your filters'
                  : 'You haven\'t created any polls yet'}
              </Text>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={onOpen}
                size="md"
              >
                Create Your First Poll
              </Button>
            </Box>
          ) : (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                mb={6}
              >
                {currentPolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    showActions={true}
                  />
                ))}
              </SimpleGrid>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 20, 50, 100]}
              />
            </>
          )}
        </VStack>

        <CreatePollModal isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
};

export default Dashboard;
