//Here is reusable logic
// import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import axios from 'axios';
import constants from '../config/constants';
// import localStorageService from './localStoreService';
// import { showNotification } from '../../client/components/Error/ErrorAction';
import { LogManagerApi } from '../components/react-native-teso';


export default function callApi(type = '', model = '', endpoint, method = 'GET', body, header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'cache-control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
    // "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1MTY4NTQ0NjAsInVrZXkiOiJCWCIsImV4cCI6MTUxOTQ0NjQ2MCwiaWF0IjoxNTE2ODU0NDYwLCJkaWQiOiIwOUNFMkE4REUyNTY0MjFEQTNGOUM0OTQwMEFBNzNERiIsImp0aSI6ImVjZWM5MmM0NGUwZDQ4MGFhYmVlNTY0ZTFjMWEyYWMxIiwiY2lkIjoiMjkyMjY0ODg0NSJ9.VQUbNvT5QgVNwQ2OUriWEezt3goPi0Th2kSGDM0mc0o",
}) {
    console.log('callApi body ', JSON.stringify(body))
    return new Promise((resolve, reject) => {
        // const user = localStorageService.getUser();
        // if (user && user.token !== undefined) {
        // header[] = ;
        // }
        setTimeout(() => {
            reject({ message: 'Timeout' });
        }, 20000);
        fetch(`${constants.hostApi}${endpoint}`, {
            headers: header,
            method,
            body: body,
        })
            .then(response => {
                console.log('response api: ', response, method)
                return response.json()
                    .then(json => ({ json, response }))
            })
            .then(({ json, response }) => {
                console.log('call api: ', `${constants.hostApi}${endpoint}`, response, json)
                if (!response.ok || (json.ErrorCode != 0)) {
                    reject({ status: response.status, message: 'Lỗi kết nối', messageLog: json.Response });
                }
                switch (json.StatusCode) {
                    case 1:
                        reject({ message: '', messageLog: { response, json } });
                        break;
                    case 404:
                        reject({ message: 'Không có kết nối', messageLog: { response, json } });
                        break;
                    case 200:
                        return resolve(json)
                        break;
                    case 510:
                        console.log(type, model)
                        reject({ message: `${type} ${model} không thành công`, messageLog: { response, json } });
                        break;
                    case 1000:
                        reject({ message: `${type} không thành công`, messageLog: { response, json } });
                        break;
                    case 1001:
                        reject({ message: `Thuộc tính không hợp lệ`, messageLog: { response, json } });
                        break;
                    case 1010:
                        reject({ message: `${model} đã tồn tại`, messageLog: { response, json } });
                        break;
                    case 1011:
                        reject({ message: `Đạt giớ hạng`, messageLog: { response, json } });
                        break;
                    case 1012:
                        reject({ message: `Chức năng này đã bị khoá`, messageLog: { response, json } });
                        break;
                    default:
                        reject({ message: 'Không thực hiện được chức năng này', messageLog: { response, json } });
                        break;
                };
            })
            .then(response => response)
            .catch(err => {
                console.log('call api error ', `${constants.hostApi}${endpoint}`, JSON.stringify(err));
                LogManagerApi(`call api error ${constants.hostApi}${endpoint}`, JSON.stringify(err));
                reject({ message: 'Lỗi kết nối' });
            });
    });
}

// export function callApiUploadFile(body, method = 'post', header = { 'content-type': 'application/json' }) {
// 	return new Promise((resolve, reject) => {
// 		// const user = localStorageService.getUser();
// 		// const token = user.token;
// 		axios.post(`${API_URL}/users/profile/upload_avatar`, body, { headers: { 'x-access-token': token } })
// 			.then((response) => {
// 				if (response.status === 200) {
// 					showNotification('success', 'Up load file thành công!');
// 					// swal('Good Job!', 'Up load file thành công!', 'success');
// 					return resolve(response.data);
// 				}
// 				showNotification('error', 'Có lỗi xảy ra! Không thể up được file!');
// 				// swal('Có lỗi xảy ra!', 'Không thể up được file!', 'error');
// 				return reject(response);
// 			})
// 			.catch((error) => {
// 				if (error !== undefined) {
// 					showNotification('error', 'Có lỗi xảy ra! Không thể up được file!');
// 					// swal('Có lỗi xảy ra!', 'Không thể up được file!', 'error');
// 				}
// 			});
// 	});
// }
