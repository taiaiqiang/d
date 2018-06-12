import { take, put, cancelled, fork, all, call, cancel } from 'redux-saga/effects';
import api from '../api';
import actionWrapper from './actionWrapper';



const createCommonActionWrapperParams = (type: string) => ({
    module: 'auth',
    originActionType: type,
    type: 'userinfo',
});
function* loginTask(type: string) {
    try {
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'request' }));
        const loginRes = yield call(api.login);
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), payload: loginRes }));
    }
    catch (e) {
        //登录失败
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'error' }));
    }
    finally {
        //取消登录
        if (yield cancelled())
            yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'cancel' }));
    }
}
function* logoutTask(type: string) {
    try {
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'request' }));
        const loginRes = yield api.logout();
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), payload: loginRes }));
    }
    catch (e) {
        //注销失败
        yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'error' }));

    }
    finally {
        //取消登录
        if (yield cancelled())
            yield put(actionWrapper({ ...createCommonActionWrapperParams(type), status: 'cancel' }));
    }
}
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
                loginTaskTag = yield fork(loginTask, 'login');
                break;
            case 'logout':
                //撤销登录行为
                if (loginTaskTag) {
                    yield cancel(loginTaskTag);
                }
                //开始注销
                logoutTaskTag = yield fork(logoutTask, 'logout');
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