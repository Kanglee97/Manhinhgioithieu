import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';

const loggerMiddleware = createLogger({
  predicate: () => process.env.NODE_ENV === 'development'
});

const sagasMiddleware = createSagaMiddleware();

const middlewares = [sagasMiddleware, loggerMiddleware];

export default (initialState = {}) => {
  try{
    const store = createStore(
      reducers,
      initialState,
      applyMiddleware(...middlewares)
    );
    const persistor = persistStore(store);
    sagasMiddleware.run(sagas);

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./reducers', () => {
        const nextReducer = require('./reducers');
        store.replaceReducer(nextReducer);
      });
    }
    return { store, persistor }
  }
  catch (error){
    console.log(' store error ',error)
  }
};
