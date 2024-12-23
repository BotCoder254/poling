import { doc, runTransaction, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

export const handleVote = async (pollId, optionIndex, userId) => {
  const pollRef = doc(db, 'polls', pollId);

  try {
    await runTransaction(db, async (transaction) => {
      const pollDoc = await transaction.get(pollRef);
      
      if (!pollDoc.exists()) {
        throw new Error('Poll not found');
      }

      const pollData = pollDoc.data();
      
      // Check if poll is still active
      if (pollData.status !== 'active') {
        throw new Error('This poll is no longer active');
      }

      // Check if user has already voted
      if (pollData.voters && pollData.voters[userId]) {
        throw new Error('You have already voted in this poll');
      }

      // Update the votes count for the selected option
      const updatedOptions = [...pollData.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        votes: (updatedOptions[optionIndex].votes || 0) + 1,
      };

      // Update poll document
      transaction.update(pollRef, {
        options: updatedOptions,
        [`voters.${userId}`]: {
          timestamp: new Date(),
          optionIndex,
        },
        totalVotes: increment(1),
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error in vote transaction:', error);
    throw error;
  }
};

export const getPollResults = (poll) => {
  if (!poll || !poll.options) return [];

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);

  return poll.options.map((option) => ({
    ...option,
    percentage: totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0,
  }));
};
