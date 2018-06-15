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

//你也可以不通过发送对应的取消action来撤销任务,直接通过`clearEffectsTask`
const loginTaskId = actions.login();
setTimeout(clearEffectsTask, 2000, loginTaskId);

```
3. 你可以在监听到对应的action时处理自己的任务通过`taskWrapper`

    1. taskWrapper接受的module、field会将数据存储为对应的路径
    2. api则会调用执行并将执行的结构存储在路径中
    

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