import store from '../store';


export default{
    login:()=>store.dispatch({ type: 'login' }),
    logout:()=>store.dispatch({ type: 'logout' }),
    cancelLogin:()=>store.dispatch({ type: 'login/cancel' }),
    cancelLogout:()=>store.dispatch({ type: 'logout/cancel' }),
}