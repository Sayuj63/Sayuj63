import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// SEED DATABASE FUNCTION REMOVED FOR PRODUCTION SECURITY
// To re-enable, add a static API Key check or restrict to local emulators
/*
export const seedDatabase = functions.https.onRequest(async (req, res) => {
    ... existing code ...
});
*/
