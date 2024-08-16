import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./cremas-5a324-firebase-adminsdk-ge8km-456d2cc006.json" assert { type: "json" };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "cremas-5a324.appspot.com"
});

export const db = getFirestore();
export const bucket = admin.storage().bucket()