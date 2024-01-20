import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyBz58TRXbfKBkpuQyYv5QBTx6BgK3ysl_Y',
  authDomain: 'chat-app-73bff.firebaseapp.com',
  databaseURL: 'https://chat-app-73bff-default-rtdb.firebaseio.com',
  projectId: 'chat-app-73bff',
  storageBucket: 'chat-app-73bff.appspot.com',
  messagingSenderId: '397070434917',
  appId: '1:397070434917:web:341caa413588b6cc097c8c',
  measurementId: 'G-46KH7JW57V',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
