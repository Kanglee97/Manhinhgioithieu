//import FirebaseClient from '../../../../../config/FireBaseClient/FirebaseClient';

import FirebaseClient from '../../config/FireBaseClient/FirebaseClient'
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'react-native-firebase';
import { Platform, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import ImageResizer from 'react-native-image-resizer';
import * as storeService from '../../sagas/storeService'
import { storeImageActions } from '../../actions'

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;

const uploadImage = (uri, mime = 'image/jpeg') => {
  //Upload image to firebase
  console.log('uploadImage', FirebaseClient, uri, mime)
  //const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
  let imgUri = uri; let uploadBlob = null;
  storeService.dispatch(storeImageActions.addImage({ 'image': uri }))
  console.log('addImage')
  return new Promise((resolve, reject) => {

    const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
    const imageRef = FirebaseClient.storage().ref('/UserImages/').child(`${uuid.v4()}`);
    // ${uploadUri.split('/')[uploadUri.split('/').length - 1]}
    console.log(`Upload image:`);
    console.log(uploadUri.split('/')[uploadUri.split('/').length - 1]);
    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime}; BASE64` });
      })
      .then((blob) => {
        uploadBlob = blob;
        console.log(blob);
        return imageRef.put(uri, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then((url) => {
        console.log(url);
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      })
  })
}

// const uploadImage = (uri, mime = 'image/jpeg') => {
//   console.log('uploadImage', FirebaseClient, uri, mime);
//   let imgUri = uri;
// return new Promise((resolve, reject) => {
// const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
// return uploadUri;
// fs.readFile(uploadUri, 'base64')
//   .then((data) => {
//     return Blob.build(data, { type: `${mime}; BASE64` });
//   })
//   .then((data) => {
//     console.log('image:', data._ref);
//     resolve(data._ref);
//   })
//   .catch((error) => {
//     reject(error);
//   })
// })
// }
export default uploadImage