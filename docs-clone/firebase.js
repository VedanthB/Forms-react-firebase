import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDsi621FUfJy-GTro3N9JeAhGcDhgAdWNw",
  authDomain: "docs-clone-nextjs.firebaseapp.com",
  projectId: "docs-clone-nextjs",
  storageBucket: "docs-clone-nextjs.appspot.com",
  messagingSenderId: "451354938320",
  appId: "1:451354938320:web:3c40b947c7bc1a5dd087d5",
};
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
