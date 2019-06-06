import ImagePicker from 'react-native-image-crop-picker';
import uploadImage from './uploadImage'

const selectImage = (width = 250, height = 250) => {
    //Select image from library
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            ImagePicker.openPicker({
                // multiple: true,
                width: width,
                height: height,
                cropping: true
            }).then(response => {
                console.log(response);
                resolve(response)
                // return uploadImage(response.path)
                //     .then(url => {
                //         console.log('selectImage', url)
                //         resolve(url);
                //     })
                //     .catch(error => console.log(error))
            }).catch(err => {
                reject(err)
            });
        }, 500);
    })
}

const takeImage = (width = 250, height = 250) => {
    //Take image by open camera
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            ImagePicker.openCamera({
                width: width,
                height: height,
                cropping: true
            }).then(response => {
                console.log(response);
                resolve(response)
                // return uploadImage(response.path)
                //     .then(url => {
                //         console.log('selectImage', url)
                //         resolve(url);
                //     })
                //     .catch(error => console.log(error))
            }).catch(err => {
                reject(err)
            });
        }, 500);
    })
}


export default {
    selectImage,
    takeImage,
    uploadImage
}