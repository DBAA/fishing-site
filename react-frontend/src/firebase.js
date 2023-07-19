import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAaGQwSXoDA91aQxYLvi2goSuWlSmWWpUg",
  authDomain: "fishing-db-6d191.firebaseapp.com",
  databaseURL: "https://fishing-db-6d191-default-rtdb.firebaseio.com/",
  projectId: "fishing-db-6d191",
  storageBucket: "fishing-db-6d191.appspot.com",
  messagingSenderId: "799012465847",
  appId: "1:799012465847:web:1502592496803700a2f132"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default firebase;
