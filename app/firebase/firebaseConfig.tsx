import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD06ycxLkKTi9bneA1qsQEDBVsju4a7Kgs",
  authDomain: "todo-firebase-7e7fc.firebaseapp.com",
  projectId: "todo-firebase-7e7fc",
  storageBucket: "todo-firebase-7e7fc.appspot.com",
  messagingSenderId: "1024147822936",
  appId: "1:1024147822936:web:7df5192f3a6bc658e8ed2d"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db =getFirestore(app);
export default app