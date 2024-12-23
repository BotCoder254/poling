#!/bin/bash

# Install Firebase Admin SDK
npm install firebase-admin

# Download service account key (you need to be logged in to Firebase CLI)
firebase login
firebase projects:list

# Set environment variable for Firebase Admin SDK
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

# Run the index creation script
node firebase-indexes.js
