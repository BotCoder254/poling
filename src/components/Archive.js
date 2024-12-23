import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Spinner,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { usePollManagement } from '../hooks/usePollManagement';
import PollCard from './PollCard';
import { useState, useEffect, useRef } from 'react';

const Archive = () => {
  const [archivedPolls, setArchivedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const { currentUser } = useAuth();
  const { unarchivePoll, deletePoll, loading: actionLoading } = usePollManagement();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const fetchArchivedPolls = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'polls'),
        where('status', '==', 'archived'),
        where('createdBy', '==', currentUser.uid),
        orderBy('archivedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const polls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setArchivedPolls(polls);
    } catch (err) {
      console.error('Error fetching archived polls:', err);
      setError(err.message);
      toast({
        title: 'Error loading archived polls',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedPolls();
  }, [currentUser]);

  const handleUnarchive = async (pollId) => {
    const success = await unarchivePoll(pollId);
    if (success) {
      await fetchArchivedPolls();
    }
  };

  const handleDelete = async () => {
    if (!selectedPollId) return;
    
    const success = await deletePoll(selectedPollId);
    if (success) {
      await fetchArchivedPolls();
    }
    onClose();
    setSelectedPollId(null);
  };

  const confirmDelete = (pollId) => {
    setSelectedPollId(pollId);
    onOpen();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Spinner size="xl" />
          <Text>Loading archived polls...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Archived Polls</Heading>
        {archivedPolls.length === 0 ? (
          <Text>No archived polls found.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {archivedPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                showActions={true}
                onUnarchive={() => handleUnarchive(poll.id)}
                onDelete={() => confirmDelete(poll.id)}
                isArchived={true}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Poll
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
              All votes and data associated with this poll will be permanently deleted.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={actionLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Archive;
