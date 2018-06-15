import { combineReducers } from "redux";
import _ from 'lodash';

type action = {
    type: string,
    field: string,
    module?: string,
    payload?: any,
    originActionType?: string,
}
type statusProps = {
    [module: string]: {
        [field: string]: {
            loading: boolean,
            cancle: boolean,
            updateTime: Date
        }
    }
};

const defaultState: any = {
    auth: {}
};
const defaultStatusState: statusProps = {};

const autoHandleReducers = (module: string, fields: Array<string>) => (state: any = defaultState[module], action: action, ) => {
    const { type, payload,field } = action;
   // const field = type.split('/')[0] || '';

    if (fields.includes(field) && !_.isEqual(state[field], payload)) {
        return { ...state, [field]: Object.assign({}, state[field], payload) };
    } else {
        return state || defaultState[module];
    }
};

const createStatusStructure = (module: string, fields: Array<string>) => {
    defaultStatusState[module] = {};

    fields.forEach(field => {
        defaultStatusState[module][field] = {
            loading: false,
            cancle: false,
            updateTime: new Date
        };
    })
}

const modules: Array<string> = ['auth:userinfo.test'];
const reducers: any = {};
modules.forEach(item => {
    const [all, module, fields] = /^(.*)+:(.*)+$/.exec(item);
    const f = fields.split('.')
    createStatusStructure(module, f);
    reducers[module] = autoHandleReducers(module, f);
})


export default combineReducers({
    ...reducers,
    loading(state = defaultStatusState, action: action) {
        const { type, module, field } = action;
        
        const [realType, status = '',] = type.split('/');
        switch (true) {
            case status === 'request':
                return _.defaultsDeep({}, { [module]: { [field]: { loading: true } } }, state);
            case status === 'success':
                return _.defaultsDeep({}, { [module]: { [field]: { loading: false } } }, state);
            case status === 'error':
                return _.defaultsDeep({}, { [module]: { [field]: { loading: false } } }, state);
            case status === 'cancel':
                return _.defaultsDeep({}, { [module]: { [field]: { loading: false } } }, state)

            default:
                return state;
        }
    }
});