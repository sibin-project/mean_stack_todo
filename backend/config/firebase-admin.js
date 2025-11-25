import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            // Check if we have the service account key in env (as JSON string)
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                try {
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                } catch (e) {
                    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e);
                }
            }
            // Check if we have the service account key path in env
            else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                admin.initializeApp({
                    credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
                });
            } else {
                console.warn('⚠️ GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT not found in .env. Firebase Admin not initialized.');
            }
            console.log('✅ Firebase Admin initialized');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
    }
};

export { admin, initializeFirebase };
