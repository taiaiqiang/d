import { all, put, cancel } from 'redux-saga/effects'
import login from './login';
import store from '../store';

export default function* root() {
  yield all([login()]);
}
const clearEffectsTask = function (id: any): any {
  if (id) {
    id.type += '/cancel';
    store.dispatch(id)
  }
}
export {
  clearEffectsTask
}