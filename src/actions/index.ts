import store from '../store';

interface task {
    name:string,
    tag:object
}
const taskQueue:task[] = [];

export default {
    login:()=>store.dispatch({ type: 'login' },taskQueue),
    logout:()=>store.dispatch({ type: 'logout' }),
    cancelLogin:()=>store.dispatch({ type: 'login/cancel' }),
    cancelLogout:()=>store.dispatch({ type: 'logout/cancel' }),
}
export {
    taskQueue,
}