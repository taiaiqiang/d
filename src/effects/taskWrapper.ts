
import { take, takeLatest, put, cancelled, fork, all, call, cancel, apply } from 'redux-saga/effects';
import actionWrapper from './actionWrapper';
//import {Func1,Func2CallEffectNamedFn } from 'redux-saga/effects';

interface params { module: string, field: string, type: string, api: any };

const taskWrapper = ({ module, field, type, api }: params) => function* taskWrappe() {
    try {
        yield put(actionWrapper({ module, field, originActionType: type, status: 'request', }));
        const loginRes = yield call(api);
        yield put(actionWrapper({ module, field, originActionType: type, payload: loginRes }));
    }
    catch (e) {
        //登录失败
        yield put(actionWrapper({ module, field, originActionType: type, status: 'error' }));
    }
    finally {
        //取消登录
        if (yield cancelled())
            yield put(actionWrapper({ module, field, originActionType: type, status: 'cancel' }));
    }
}


export default taskWrapper;