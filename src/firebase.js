import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPl_GlBV3HjwUfu2Ehcr23_mrFTWUkfKQ",
  authDomain: "pubgo-44c8d.firebaseapp.com",
  projectId: "pubgo-44c8d",
  storageBucket: "pubgo-44c8d.appspot.com",
  messagingSenderId: "277245045389",
  appId: "1:277245045389:web:c4b0349c4cac023c1050c4",
  databaseURL: "https://pubgo-44c8d-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth();

//connectAuthEmulator(auth,"http://localhost:9099")
//connectDatabaseEmulator(database,"http://localhost:9000")

export default app;
export {
  database,
  auth
}