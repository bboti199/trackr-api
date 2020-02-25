import { initializeApp, credential } from 'firebase-admin';
import { config } from 'dotenv';

config({ path: '.firebase.env' });

let params = '';
if (process.env.FIREBASE_CREDS) {
  params = JSON.parse(process.env.FIREBASE_CREDS);
} else {
  console.error('Can not find firebase config. Exiting...');
  process.exit(1);
}

export const firebaseApp = initializeApp({
  credential: credential.cert(params),
  databaseURL: process.env.FIREBASE_DB_URL
});
