import { take, fork, cancel } from 'redux-saga/effects';
import api from '../api';
import taskWrapper from './taskWrapper';
export default function* () {
    let loginTaskTag: any, logoutTaskTag: any;
    while (true) {
        //监听登录注销action
        const { type } = yield take(['login', 'logout', 'login/cancel', 'logout/cancel']);
        switch (type) {
            case 'login':
                //撤销注销行为
                if (logoutTaskTag) {
                    yield cancel(logoutTaskTag);
                }
                //开始登陆
                loginTaskTag = yield fork(
                    taskWrapper({
                        module: 'auth',
                        field: 'userinfo',
                        type: 'login',
                        api: api.login
                    })
                );
                break;
            case 'logout':
                //撤销登录行为
                if (loginTaskTag) {
                    yield cancel(loginTaskTag);
                }
                //开始注销
                logoutTaskTag = yield fork(
                    taskWrapper({
                        module: 'auth',
                        field: 'userinfo',
                        type: 'login',
                        api: api.logout
                    })
                );
            case 'login/cancel':
                //撤销登录行为
                if (loginTaskTag) {
                    yield cancel(loginTaskTag);
                };
                break;
            case 'logout/cancel':
                //撤销注销行为
                if (logoutTaskTag) {
                    yield cancel(logoutTaskTag);
                }
                break;
        }

    }
}