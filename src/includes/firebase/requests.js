import { auth, usersCollection } from './firebase';

// Authenticate an user via Firebase Authenication
async function firebaseEmailAndPasswordAuth(email, password) {
  try {
    const userCredentials = await auth.createUserWithEmailAndPassword(email, password);
    return userCredentials;
  } catch (error) {
    return null;
  }
}

// Create and add an user document via Firebase Firestore database
async function firebaseAddUserToCollection(user) {
  try {
    const userDocument = await usersCollection.add(user);
    console.log(userDocument);
    return userDocument;
  } catch (error) {
    return null;
  }
}

export {
  firebaseEmailAndPasswordAuth,
  firebaseAddUserToCollection
};
