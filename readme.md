# App数据说明

## 简介:已存在的问题和解决方案

1. 单页面中涉及到大量的业务逻辑，渲染判断跟数据拉取耦合。拿登录页来说，可以点击按钮后请求接口->成功后dispatch 一个存储用户数据的action->存token->跳转页面...
现在可以点击按钮值dispatch以后登录请求的action,页面逻辑在一处统一管理(即sage中),将渲染逻辑与业务逻辑解耦。
2. 在进入一个页面后,可能需要请求数据,在用户返回之后,这个请求一直在进行中,并一直显示Loading,现在可以返回页面是撤销这个操作,对于的sage中则不走拉取数据成功后存到redux中,对于Tip组件则需要维护一个loading的栈,可进可出。

## 基于redux—sage简单封装的使用说明
    还是拿登录来说

1. 点击Button

```jsx
<Button  onPress={() => this.props.dispatch({ type: 'login' })}>
        登录
</Button>
```
2. 将逻辑处理权交于sage
```js
function* () {
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
```
3. 你可以发送任意的的action,只不过是否捕获此请求和如何处理掌握在自己手里,下面看看捕获login的loginTask干了些什么
```js
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
```
    1. 先发送了一个status为request的action
    2. 在接口数据返回时发送status为success的action(status缺省值为success)
    3. 下面的catch和finally分别是login失败和取消的逻辑
    4. createCommonActionWrapperParams中的三个key分别为数据存储的模块名、导致存储的源action.type(即login)、数据存储的模块名的字段名

4. 来看一下如何在组件中取存在redux中的数据
```js
type Props = {
    auth: {
        [fieldName: string]: any
    },
    userinfo: {
        isLogin: boolean,
        name: string
    },
    loading: {
        [moduleName: string]: {
            [fidleName: string]: {
                loading: boolean,
                cancle: boolean,
                updateTime: Date
            }
        }
    },
    dispatch: Function
};
@connect(({ auth, loading }: Props) => ({ userinfo: auth.userinfo, loading: loading.auth.userinfo.loading }))
```
Props中展示了数据结构