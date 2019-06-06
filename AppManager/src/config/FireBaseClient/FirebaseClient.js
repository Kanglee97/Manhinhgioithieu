import firebase from 'react-native-firebase';
import { firebaseApiKey, firebaseStorageBucket } from '../../config/constants';
// import { API_KEY } from 'react-native-dotenv';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDT4Xv0nqCcYaIQuQKchgX-IOUZMDOAvEQ",
    authDomain: "salozo.firebaseapp.com",
    databaseURL: "https://salozo.firebaseio.com",
    projectId: "salozo",
    storageBucket: "salozo.appspot.com",
    messagingSenderId: "47770210835",
    appId: "1:47770210835:web:d1d4a0103afc56f9"
    // authDomain: "dailydrip-firebase-storage.firebaseapp.com",
    // databaseURL: "https://dailydrip-firebase-storage.firebaseio.com",
    //storageBucket: firebaseStorageBucket
}

//if (!firebase.apps.length) {
var firebaseApp = firebase.initializeApp(firebaseConfig)
//}

export default firebaseApp