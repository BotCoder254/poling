const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
  projectId: "twitterclone-47ebf"
});

const db = getFirestore();

async function createIndexes() {
  try {
    // Create index for polls collection
    const pollsCollection = db.collection('polls');
    
    // Index for createdBy and createdAt
    await pollsCollection.createIndex({
      fields: [
        { fieldPath: 'createdBy', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
        { fieldPath: '__name__', order: 'DESCENDING' }
      ]
    });

    // Index for status and createdAt
    await pollsCollection.createIndex({
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    // Index for category and createdAt
    await pollsCollection.createIndex({
      fields: [
        { fieldPath: 'category', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    // Index for voters array and createdAt
    await pollsCollection.createIndex({
      fields: [
        { fieldPath: 'voters', arrayConfig: 'CONTAINS' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

createIndexes();
