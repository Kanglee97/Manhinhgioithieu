import firebase from 'react-native-firebase'
import * as storeService from '../../../../sagas/storeService'
import { nameOfChatReducers, nameOfProfileReducers, nameOfCustomerReducers, nameOfMessengerReducers, nameOfStoreDetailReducers } from '../../../../reducers'
import { get } from 'lodash'
import { messengerActions } from '../../../../actions/index';
import {
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseDatabaseURL,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId
} from '../../../../config/constants';

class Fire {
    constructor() {

        this.init();
        // 1.
        this.observeAuth();
    }

    init = () =>
        firebase.initializeApp({
            //apiKey: firebaseApiKey,
            authDomain: firebaseAuthDomain,
            apiKey: "AIzaSyDT4Xv0nqCcYaIQuQKchgX-IOUZMDOAvEQ",
            databaseURL: firebaseDatabaseURL,
            projectId: firebaseProjectId,
            storageBucket: firebaseStorageBucket,
            messagingSenderId: firebaseMessagingSenderId
        });

    observeAuth = () =>
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
            try {
                firebase.auth().signInAnonymously();
            } catch ({ message }) {
                alert(message);
            }
        }
    };

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get ref() {
        return firebase.database().ref(`messenger/${get(storeService.getSpecificState(nameOfProfileReducers), 'user.id')}_${get(storeService.getSpecificState(nameOfCustomerReducers), 'detail.info.id')}/message/`)
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    on = callback =>
        this.ref
            .limitToLast(50)
            .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    // send the message to the Backend
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                timestamp: this.timestamp,
            };
            this.append(message);
        }
        storeService.dispatch(messengerActions.pushNotificationRequest({
            "data": {
                "title": `Hệ thống`,
                "content": `Bạn có một tin nhắn từ Chủ cửa hàng ${get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.displayName')}`,
                "id": get(storeService.getSpecificState(nameOfCustomerReducers), 'detail.info.id')
            },
            callback: () => {

            }
        }))
    };

    append = message => this.ref.push(message);

    // close the connection to the Backend
    off() {
        this.ref.off();
    }
}
Fire.shared = new Fire('messenge');
export default Fire;