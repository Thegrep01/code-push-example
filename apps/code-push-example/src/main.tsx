import { AppRegistry } from 'react-native';
import codePush from 'react-native-code-push';

import App from './app/App';

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

const AppWithCodePush = codePush(codePushOptions)(App);

AppRegistry.registerComponent('CodePushExample', () => AppWithCodePush);
