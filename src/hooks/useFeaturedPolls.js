import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFeaturedPolls = () => {
  const [featuredPolls, setFeaturedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only query for active polls without complex ordering
    const q = query(
      collection(db, 'polls'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Get all active polls and sort them client-side
        const polls = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by number of voters (descending) and limit to 5 most voted polls
        const sortedPolls = polls
          .sort((a, b) => (b.voters?.length || 0) - (a.voters?.length || 0))
          .slice(0, 5);

        setFeaturedPolls(sortedPolls);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching featured polls:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { featuredPolls, loading, error };
};
