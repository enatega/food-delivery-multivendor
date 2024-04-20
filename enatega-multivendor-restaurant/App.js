import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import FlashMessage from 'react-native-flash-message';
import { useFonts } from '@use-expo/font';
import * as Updates from 'expo-updates';
import { AuthContext, Configuration } from './src/ui/context';
import AppContainer from './src/navigation';
import setupApolloClient from './src/apollo/client';
import { Spinner, TextDefault } from './src/components';
import { colors } from './src/utilities';
import { ActivityIndicator, StyleSheet, View, LogBox, Button } from 'react-native';
import * as Sentry from 'sentry-expo';
import getEnvVars from './environment';
import 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import ImagePicker from 'react-native-image-picker'; // Import ImagePicker

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [token, setToken] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageUri, setImageUri] = useState(null); // State to hold the selected image URI

  const { SENTRY_DSN } = getEnvVars();
  const client = setupApolloClient();

  useEffect(() => {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        enableInExpoDevelopment: true,
        debug: true,
        tracesSampleRate: 1.0 // to be changed to 0.2 in production
      })
    }
  }, [SENTRY_DSN])

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) setToken(token);
      setIsAppReady(true);
    })();
  }, []);

  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        try {
          setIsUpdating(true);
          const { isNew } = await Updates.fetchUpdateAsync();
          if (isNew) {
            await Updates.reloadAsync();
          }
        } catch (error) {
          console.log('error while updating app', JSON.stringify(error));
        } finally {
          setIsUpdating(false);
        }
      }
    })();
  }, []);

  const handleImageUpload = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        setImageUri(uri);
        // Here you would typically send the image URI to your backend for storage
        // and then retrieve the URL of the stored image to display it.
      }
    });
  };

  const login = async (token, restaurantId) => {
    await SecureStore.setItemAsync('token', token);
    await AsyncStorage.setItem('restaurantId', restaurantId);
    setToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('restaurantId');
    setToken(null);
  };

  const [fontLoaded] = useFonts({
    MuseoSans300: require('./assets/font/MuseoSans/MuseoSans300.ttf'),
    MuseoSans500: require('./assets/font/MuseoSans/MuseoSans500.ttf'),
    MuseoSans700: require('./assets/font/MuseoSans/MuseoSans700.ttf')
  });

  if (isUpdating) {
    return (
      <View
        style={[
          styles.flex,
          styles.mainContainer,
          { backgroundColor: colors.startColor }
        ]}>
        <TextDefault textColor={colors.white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  if (fontLoaded && isAppReady) {
    return (
      <ApolloProvider client={client}>
        <StatusBar style="dark" backgroundColor={colors.headerBackground} />
        <Configuration.Provider>
          <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout }}>
            <SafeAreaProvider>
              <AppContainer />
            </SafeAreaProvider>
          </AuthContext.Provider>
        </Configuration.Provider>
        <FlashMessage />
        <Button title="Upload Image" onPress={handleImageUpload} /> {/* Add a button to trigger image upload */}
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />} {/* Display the selected image if available */}
      </ApolloProvider>
    );
  } else {
    return <Spinner />;
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
