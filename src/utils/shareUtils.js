import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const generateShareableLink = (pollId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/poll/${pollId}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

export const getPollById = async (pollId) => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);
    
    if (!pollSnap.exists()) {
      throw new Error('Poll not found');
    }
    
    return {
      id: pollSnap.id,
      ...pollSnap.data()
    };
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
};
