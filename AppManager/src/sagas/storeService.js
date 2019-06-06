import { store as reduxStore, persistor as persistStore } from '../../App';
import { get } from 'lodash';

/*
export const clearPersist = () => {
  persistor.purge()
}
*/

export const getInstance = () =>{
  return reduxStore
}

//get global state of application
export const getGlobalState = () => {
  return reduxStore.getState();
}

export const purge = () => {
  persistStore.purge();
}

//get specific state
export const getSpecificState = (name) => {
  return get(getGlobalState(), name);
}

//dispatch action to current store
export const dispatch = (action) => {
  return reduxStore.dispatch(action);
}