import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAOOure2BVrVGR7EelJvVpMkSvx98Khmw0",
  authDomain: "vorniq-a671c.firebaseapp.com",
  projectId: "vorniq-a671c",
  storageBucket: "vorniq-a671c.appspot.com",
  messagingSenderId: "107779121214",
  appId: "1:107779121214:web:757aae71cfd0db46e1716f",
  measurementId: "G-4SHKL9KK2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
