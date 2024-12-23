import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMjKssyRSZJ16EhSdVOFd2XjIkj8_BT-E",
  authDomain: "twitterclone-47ebf.firebaseapp.com",
  databaseURL: "https://twitterclone-47ebf-default-rtdb.firebaseio.com",
  projectId: "twitterclone-47ebf",
  storageBucket: "twitterclone-47ebf.appspot.com",
  messagingSenderId: "700556014223",
  appId: "1:700556014223:web:a0646158ade0b1e55ab6fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported');
    }
  });

export { auth, db, storage, rtdb };
