/** @format */
import 'core-js';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// bo ios warning YellowBox
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);