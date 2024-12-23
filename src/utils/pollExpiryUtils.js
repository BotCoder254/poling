import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const checkPollExpiry = (poll) => {
  if (!poll.expiresAt) return true;
  
  const now = new Date();
  const expiryDate = poll.expiresAt.toDate();
  return now < expiryDate;
};

export const formatExpiryTime = (expiryTimestamp) => {
  if (!expiryTimestamp) return '';
  
  const date = expiryTimestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

export const getTimeRemaining = (expiryTimestamp) => {
  if (!expiryTimestamp) return null;
  
  const now = new Date();
  const expiryDate = expiryTimestamp.toDate();
  const timeRemaining = expiryDate - now;
  
  if (timeRemaining <= 0) return 'Expired';
  
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

export const closePoll = async (pollId) => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    await updateDoc(pollRef, {
      status: 'closed',
      closedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error closing poll:', error);
    throw error;
  }
};
