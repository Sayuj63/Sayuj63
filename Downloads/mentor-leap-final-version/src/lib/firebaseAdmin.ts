import * as admin from "firebase-admin";

const firebaseAdminConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
};

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
            throw new Error("Firebase Admin credentials missing. Please add FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL to your .env.local file.");
        }
        try {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseAdminConfig as any),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        } catch (error: any) {
            throw new Error("Failed to initialize Firebase Admin: " + error.message);
        }
    }
    return admin;
}

// Getters to ensure we only call getFirebaseAdmin() when needed
export const db = {
    collection: (name: string) => getFirebaseAdmin().firestore().collection(name),
    doc: (path: string) => getFirebaseAdmin().firestore().doc(path),
} as any; // Cast to any to preserve compatibility with existing service calls

export const auth = {
    verifyIdToken: (token: string) => getFirebaseAdmin().auth().verifyIdToken(token),
    setCustomUserClaims: (uid: string, claims: any) => getFirebaseAdmin().auth().setCustomUserClaims(uid, claims),
} as any;

export const storage = {
    bucket: (name?: string) => getFirebaseAdmin().storage().bucket(name),
} as any;

export { admin };
