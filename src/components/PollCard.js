import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Progress,
  Badge,
  HStack,
  IconButton,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import {
  FiArchive,
  FiTrash2,
  FiRefreshCcw,
  FiMoreVertical,
  FiEdit2,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { usePollManagement } from '../hooks/usePollManagement';

const PollCard = ({
  poll,
  showActions = false,
  onVote,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
  isArchived = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { votePoll, loading } = usePollManagement();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleVote = async (optionId) => {
    if (hasVoted || poll.status !== 'active') return;
    
    setSelectedOption(optionId);
    const success = await votePoll(poll.id, optionId);
    if (success) {
      setHasVoted(true);
      if (onVote) onVote(poll.id, optionId);
    }
  };

  const getTotalVotes = () => {
    return poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const getStatusBadge = () => {
    switch (poll.status) {
      case 'active':
        return <Badge colorScheme="green">Active</Badge>;
      case 'archived':
        return <Badge colorScheme="gray">Archived</Badge>;
      case 'expired':
        return <Badge colorScheme="red">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="md" noOfLines={2}>
            {poll.question}
          </Heading>
          {showActions && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                aria-label="More options"
              />
              <MenuList>
                {poll.status === 'active' && (
                  <>
                    {onEdit && (
                      <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(poll.id)}>
                        Edit
                      </MenuItem>
                    )}
                    {onArchive && (
                      <MenuItem icon={<FiArchive />} onClick={() => onArchive(poll.id)}>
                        Archive
                      </MenuItem>
                    )}
                  </>
                )}
                {poll.status === 'archived' && (
                  <>
                    {onUnarchive && (
                      <MenuItem icon={<FiRefreshCcw />} onClick={() => onUnarchive(poll.id)}>
                        Unarchive
                      </MenuItem>
                    )}
                    <Divider />
                    {onDelete && (
                      <MenuItem icon={<FiTrash2 />} onClick={() => onDelete(poll.id)} color="red.500">
                        Delete
                      </MenuItem>
                    )}
                  </>
                )}
              </MenuList>
            </Menu>
          )}
        </HStack>

        <HStack spacing={2}>
          {getStatusBadge()}
          <Text fontSize="sm" color="gray.500">
            Created {formatDistanceToNow(new Date(poll.createdAt.toDate()), { addSuffix: true })}
          </Text>
        </HStack>

        <VStack align="stretch" spacing={3}>
          {poll.options.map((option) => {
            const percentage = getVotePercentage(option.votes || 0);
            const isSelected = selectedOption === option.id;
            
            return (
              <Box key={option.id}>
                <Button
                  width="100%"
                  onClick={() => handleVote(option.id)}
                  isDisabled={hasVoted || poll.status !== 'active'}
                  colorScheme={isSelected ? 'blue' : 'gray'}
                  variant={isSelected ? 'solid' : 'outline'}
                  mb={2}
                  isLoading={loading && isSelected}
                >
                  {option.text}
                </Button>
                <Progress
                  value={percentage}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                />
                <Text fontSize="sm" textAlign="right" mt={1}>
                  {percentage}% ({option.votes || 0} votes)
                </Text>
              </Box>
            );
          })}
        </VStack>

        <Text fontSize="sm" color="gray.500" textAlign="right">
          Total votes: {getTotalVotes()}
        </Text>
      </VStack>
    </Box>
  );
};

export default PollCard;
