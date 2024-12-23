import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useUserPolls = (userId) => {
  const [createdPolls, setCreatedPolls] = useState([]);
  const [participatedPolls, setParticipatedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query for polls created by user
    const createdPollsQuery = query(
      collection(db, 'polls'),
      where('createdBy', '==', userId)
    );

    // Subscribe to created polls
    const unsubscribeCreated = onSnapshot(
      createdPollsQuery,
      (snapshot) => {
        const polls = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          totalVotes: doc.data().options.reduce((acc, opt) => acc + (opt.votes || 0), 0)
        }));
        setCreatedPolls(polls);
      },
      (err) => {
        console.error('Error fetching created polls:', err);
        setError(err.message);
      }
    );

    // Query for polls where user has voted
    const participatedPollsQuery = query(
      collection(db, 'polls'),
      where('voters', 'array-contains', userId)
    );

    // Subscribe to participated polls
    const unsubscribeParticipated = onSnapshot(
      participatedPollsQuery,
      (snapshot) => {
        const polls = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          totalVotes: doc.data().options.reduce((acc, opt) => acc + (opt.votes || 0), 0)
        }));
        setParticipatedPolls(polls);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching participated polls:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeCreated();
      unsubscribeParticipated();
    };
  }, [userId]);

  return { createdPolls, participatedPolls, loading, error };
};
