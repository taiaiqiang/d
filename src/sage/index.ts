import {all} from 'redux-saga/effects'
import login from './login';
export default function* root() {
  yield all([login()]);
}