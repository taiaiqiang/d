import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware({});

interface store {
  dispatch: Function,
  runSaga: Function,
  [otherProps: string]: any
}

const store: store = {
  ...createStore(rootReducer, applyMiddleware(sagaMiddleware)),
  runSaga: sagaMiddleware.run,
};

export default store;
