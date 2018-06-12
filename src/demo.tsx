/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View
} from 'react-native';
import { Button, Loading } from '@hx/noxus';

import actions from './actions';

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

const styles = {
    container: {
        paddingTop: 20,
    },
    button: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 4,
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    loadingText: {

    }
};

@connect(({ auth, loading }: Props) => ({ userinfo: auth.userinfo, loading: loading.auth.userinfo.loading }))
export default class Demo extends Component<Props> {
    static defaultProps = {
        userinfo: {
            isLogin: false,
            name: ''
        }
    };
    render() {
        const { loading } = this.props;
        const { isLogin, name } = this.props.userinfo;
        return (
            <View style={styles.container}>
                <Button style={styles.button} onPress={actions.login}>
                    登录
                </Button>
                <Button style={styles.button} onPress={actions.logout}>
                    注销
                         </Button>
                <Button style={styles.button} onPress={actions.cancelLogin}>
                    取消登录
                         </Button>
                <Button style={styles.button} onPress={actions.cancelLogout}>
                    取消注销
                         </Button>
                <Loading visible={loading} text="..." />
                {
                    isLogin && (
                        <View>

                            <Text>登录状态:{String(isLogin)}</Text>
                            <Text>用户名:{name}</Text>
                        </View>

                    )
                }

            </View>
        );
    }
};
