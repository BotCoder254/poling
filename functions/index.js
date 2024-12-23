const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Automatically close expired polls every hour
exports.closeExpiredPolls = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    try {
      // Query for active polls that have expired
      const expiredPollsQuery = db.collection('polls')
        .where('status', '==', 'active')
        .where('expiresAt', '<=', now);

      const expiredPolls = await expiredPollsQuery.get();

      // Batch update expired polls
      const batch = db.batch();
      expiredPolls.docs.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'closed',
          closedAt: now,
          updatedAt: now
        });
      });

      await batch.commit();

      console.log(`Closed ${expiredPolls.size} expired polls`);
      return null;
    } catch (error) {
      console.error('Error closing expired polls:', error);
      throw error;
    }
  });

// Validate poll expiry on vote attempts
exports.validatePollVote = functions.firestore
  .document('polls/{pollId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    
    // Check if this is a vote update
    if (!newData.voters || !oldData.voters) return null;
    
    const newVoters = Object.keys(newData.voters).length;
    const oldVoters = Object.keys(oldData.voters).length;
    
    // If number of voters hasn't changed, this isn't a vote update
    if (newVoters <= oldVoters) return null;
    
    const now = admin.firestore.Timestamp.now();
    
    // Check if poll has expired
    if (newData.expiresAt && newData.expiresAt.toDate() <= now.toDate()) {
      // Revert the vote
      await change.after.ref.update({
        voters: oldData.voters,
        options: oldData.options,
        totalVotes: oldData.totalVotes,
        status: 'closed',
        closedAt: now,
        updatedAt: now
      });
      
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This poll has expired and is no longer accepting votes.'
      );
    }
    
    return null;
  });
