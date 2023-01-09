// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkgjSTL62v09kT4HMoIuSl0MVNXZfqVTQ",
  authDomain: "products-6e252.firebaseapp.com",
  databaseURL: "https://products-6e252-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "products-6e252",
  storageBucket: "products-6e252.appspot.com",
  messagingSenderId: "256757194700",
  appId: "1:256757194700:web:984ed9a512c5d9c4520769",
  measurementId: "G-XS22D8CWC3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, query, orderByChild } from "firebase/database";
import { getAuth } from "firebase/auth";

const db = getDatabase();
const auth = getAuth();

const myUserId = auth.currentUser.uid;
const topUserPostsRef = query(ref(db, 'user-posts/' + myUserId), orderByChild('starCount'));

