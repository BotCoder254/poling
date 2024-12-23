import { useState, useEffect } from 'react';
import { collection, onSnapshot, limit, query } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useRealTimePolls = (filters = {}) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Get the most recent 50 polls
    const pollsRef = collection(db, 'polls');
    const pollsQuery = query(pollsRef, limit(50));

    const unsubscribe = onSnapshot(
      pollsQuery,
      (snapshot) => {
        let pollsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          totalVotes: doc.data().options.reduce((acc, opt) => acc + (opt.votes || 0), 0)
        }));

        // Apply filters in memory
        if (filters.userId) {
          pollsData = pollsData.filter(poll => poll.createdBy === filters.userId);
        }
        if (filters.status) {
          pollsData = pollsData.filter(poll => poll.status === filters.status);
        }
        if (filters.category) {
          pollsData = pollsData.filter(poll => poll.category === filters.category);
        }

        // Sort by createdAt in memory
        pollsData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        setPolls(pollsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching polls:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters.userId, filters.status, filters.category]);

  return { polls, loading, error };
};
