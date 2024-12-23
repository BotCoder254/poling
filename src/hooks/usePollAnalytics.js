import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

const usePollAnalytics = (pollId) => {
  const [analytics, setAnalytics] = useState({
    totalVotes: 0,
    totalViews: 0,
    votingHistory: [],
    recentVoters: [],
    peakVotingTime: null,
    mostActiveDay: null,
    engagementRate: 0,
    votesPerDay: 0,
  });

  useEffect(() => {
    if (!pollId) return;

    // Increment view count
    const pollRef = doc(db, 'polls', pollId);
    updateDoc(pollRef, {
      views: increment(1)
    });

    // Subscribe to analytics updates
    const unsubscribe = onSnapshot(doc(db, 'polls', pollId), (doc) => {
      if (!doc.exists()) return;

      const data = doc.data();
      const totalVotes = data.voters?.length || 0;
      const totalViews = data.views || 0;
      
      // Calculate votes per day
      const daysActive = (Date.now() - new Date(data.createdAt?.seconds * 1000).getTime()) / (1000 * 60 * 60 * 24);
      const votesPerDay = totalVotes / Math.max(daysActive, 1);

      // Calculate engagement rate
      const engagementRate = totalViews > 0 ? (totalVotes / totalViews) * 100 : 0;

      // Analyze voting patterns
      const votingTimes = data.votingHistory?.map(vote => new Date(vote.timestamp?.seconds * 1000).getHours()) || [];
      const votingDays = data.votingHistory?.map(vote => new Date(vote.timestamp?.seconds * 1000).getDay()) || [];

      // Find peak voting time
      const timeCount = votingTimes.reduce((acc, time) => {
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});
      const peakVotingTime = Object.entries(timeCount).sort((a, b) => b[1] - a[1])[0]?.[0];

      // Find most active day
      const dayCount = votingDays.reduce((acc, day) => {
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
      const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0];

      setAnalytics({
        totalVotes,
        totalViews,
        votingHistory: data.votingHistory || [],
        recentVoters: data.recentVoters || [],
        peakVotingTime,
        mostActiveDay,
        engagementRate,
        votesPerDay,
      });
    });

    return () => unsubscribe();
  }, [pollId]);

  return analytics;
};

export default usePollAnalytics;
