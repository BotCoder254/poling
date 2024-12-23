import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export function usePollManagement() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const archivePoll = async (pollId) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const pollRef = doc(db, 'polls', pollId);
      const pollDoc = await getDoc(pollRef);

      if (!pollDoc.exists()) {
        throw new Error('Poll not found');
      }

      if (pollDoc.data().createdBy !== currentUser.uid) {
        throw new Error('Unauthorized to archive this poll');
      }

      await updateDoc(pollRef, {
        status: 'archived',
        archivedAt: serverTimestamp(),
      });

      toast({
        title: 'Poll archived',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error archiving poll',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unarchivePoll = async (pollId) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const pollRef = doc(db, 'polls', pollId);
      const pollDoc = await getDoc(pollRef);

      if (!pollDoc.exists()) {
        throw new Error('Poll not found');
      }

      if (pollDoc.data().createdBy !== currentUser.uid) {
        throw new Error('Unauthorized to unarchive this poll');
      }

      await updateDoc(pollRef, {
        status: 'active',
        archivedAt: null,
      });

      toast({
        title: 'Poll unarchived',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error unarchiving poll',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePoll = async (pollId) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const pollRef = doc(db, 'polls', pollId);
      const pollDoc = await getDoc(pollRef);

      if (!pollDoc.exists()) {
        throw new Error('Poll not found');
      }

      if (pollDoc.data().createdBy !== currentUser.uid) {
        throw new Error('Unauthorized to delete this poll');
      }

      // Delete the poll document
      await deleteDoc(pollRef);

      // Delete associated votes
      const votesQuery = query(
        collection(db, 'votes'),
        where('pollId', '==', pollId)
      );
      const votesSnapshot = await getDocs(votesQuery);
      const deletePromises = votesSnapshot.docs.map(voteDoc => 
        deleteDoc(doc(db, 'votes', voteDoc.id))
      );
      await Promise.all(deletePromises);

      toast({
        title: 'Poll deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error deleting poll',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const votePoll = async (pollId, optionId) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      await runTransaction(db, async (transaction) => {
        // Get the poll document
        const pollRef = doc(db, 'polls', pollId);
        const pollDoc = await transaction.get(pollRef);

        if (!pollDoc.exists()) {
          throw new Error('Poll not found');
        }

        // Check if poll is still active
        if (pollDoc.data().status !== 'active') {
          throw new Error('This poll is no longer active');
        }

        // Check if user has already voted
        const votesQuery = query(
          collection(db, 'votes'),
          where('pollId', '==', pollId),
          where('userId', '==', currentUser.uid)
        );
        const votesSnapshot = await getDocs(votesQuery);

        if (!votesSnapshot.empty) {
          throw new Error('You have already voted in this poll');
        }

        // Create the vote document
        const voteRef = doc(collection(db, 'votes'));
        transaction.set(voteRef, {
          pollId,
          userId: currentUser.uid,
          optionId,
          createdAt: serverTimestamp(),
        });

        // Update poll vote counts
        const pollData = pollDoc.data();
        const updatedOptions = pollData.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: (option.votes || 0) + 1 };
          }
          return option;
        });

        transaction.update(pollRef, {
          options: updatedOptions,
          totalVotes: (pollData.totalVotes || 0) + 1,
        });
      });

      toast({
        title: 'Vote recorded',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error voting',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    archivePoll,
    unarchivePoll,
    deletePoll,
    votePoll,
    loading,
  };
}
