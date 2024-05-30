import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDyaqu9Jw9zzZ4EVZsadcbEqStQKz32k48",
  authDomain: "chat-app-efec6.firebaseapp.com",
  projectId: "chat-app-efec6",
  storageBucket: "chat-app-efec6.appspot.com",
  messagingSenderId: "921412426684",
  appId: "1:921412426684:web:179dc270e7eacc51f929b9",
  measurementId: "G-KE8X1SKFWY",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

auth.useEmulator("http://localhost:9099");
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", "8080");
}

export { auth, db };
export default firebase;
