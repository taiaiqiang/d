/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@hx/noxus';

import store from './src/store';
import sage from './src/effects';
import Demo from './src/demo.tsx';

store.runSaga(sage);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={{ button: { color: '#333', backgroundColor: 'red', } }}>
          <Demo />
        </ThemeProvider>
      </Provider>

    );
  }
}
