/* eslint-disable jsx-a11y/accessible-emoji */
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Switch,
} from 'react-native';
import codePush from 'react-native-code-push';
import type { LocalPackage } from 'react-native-code-push';
import {
  CODEPUSH_PRODUCTION_DEPLOYMENT_KEY,
  CODEPUSH_STAGING_DEPLOYMENT_KEY,
} from '../constants';

export const App = () => {
  const [version, setVersion] = useState<LocalPackage | null>(null);
  const [isProdUser, setIsProdUser] = useState(true);

  useEffect(() => {
    codePush.getUpdateMetadata().then((update) => {
      console.log({ update });
      setVersion(update);
    });
  }, []);

  const onButtonPress = async () => {
    await codePush.sync(
      {
        updateDialog: {
          appendReleaseDescription: true,
          title: 'New Update!',
        },
        installMode: codePush.InstallMode.IMMEDIATE,
        deploymentKey: !isProdUser
          ? CODEPUSH_STAGING_DEPLOYMENT_KEY
          : CODEPUSH_PRODUCTION_DEPLOYMENT_KEY,
      },
      async (status: codePush.SyncStatus) => {
        if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
          const v = await codePush.getUpdateMetadata();

          setVersion(v);
        }
      }
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.textLg}>Hello there,</Text>
            <Text style={[styles.textXL, styles.appTitleText]} testID="heading">
              Welcome CodePushPoc 👋
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
            }}
          >
            <Text>Change from Beta to Prod</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isProdUser ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsProdUser}
              value={isProdUser}
            />
          </View>
          <TouchableOpacity style={styles.hero} onPress={onButtonPress}>
            <Text style={styles.monospace}>Check for updates</Text>
          </TouchableOpacity>
          <View>
            <Text>App version: {version?.appVersion}</Text>
            <Text>CodePush version: {version?.label}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
  },

  monospace: {
    color: '#ffffff',
    fontFamily: 'Courier New',
    marginVertical: 4,
  },
  textLg: {
    fontSize: 24,
  },
  textXL: {
    fontSize: 48,
  },
  section: {
    marginVertical: 12,
    marginHorizontal: 12,
  },
  appTitleText: {
    paddingTop: 12,
    fontWeight: '500',
  },
  hero: {
    borderRadius: 12,
    backgroundColor: '#143055',
    padding: 36,
    marginBottom: 24,
  },
});

export default App;
