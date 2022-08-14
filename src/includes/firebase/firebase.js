import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCRjrn_gEiP3vmFawANiaee_WpOdHvYjy4',
  authDomain: 'ztm-vue-music-firebase.firebaseapp.com',
  projectId: 'ztm-vue-music-firebase',
  storageBucket: 'ztm-vue-music-firebase.appspot.com',
  appId: '1:905759210264:web:a94e774f5a8665849fbc6d'
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestoreDatabase = firebase.firestore();
const storage = firebase.storage();

const usersCollection = firestoreDatabase.collection('users');
const songsCollection = firestoreDatabase.collection('songs');
const commentsCollection = firestoreDatabase.collection('comments');

export {
  auth,
  firestoreDatabase,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage
};
