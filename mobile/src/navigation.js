import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useApp } from './context/AppContext';
import {
  AdminCreateEventScreen,
  AdminDashboardScreen,
  AdminForgotPasswordScreen,
  AdminLoginScreen,
  AdminProfileScreen,
  AdminRegisterScreen,
  AdminUploadPhotosScreen,
  GuestEventAccessScreen,
  GuestGalleryScreen,
  GuestSelfieScreen,
  HomeScreen,
} from './screens';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoggedIn, ready } = useApp();

  if (!ready) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#F7EFE6' },
          headerShadowVisible: false,
          headerTintColor: '#2F1F1B',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GuestEventAccess" component={GuestEventAccessScreen} options={{ title: 'Event Access' }} />
        <Stack.Screen name="GuestSelfie" component={GuestSelfieScreen} options={{ title: 'Upload Selfie' }} />
        <Stack.Screen name="GuestGallery" component={GuestGalleryScreen} options={{ title: 'Gallery' }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Photographer Login' }} />
        <Stack.Screen name="AdminRegister" component={AdminRegisterScreen} options={{ title: 'Register Photographer' }} />
        <Stack.Screen name="AdminForgotPassword" component={AdminForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
        {isLoggedIn ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
            <Stack.Screen name="AdminCreateEvent" component={AdminCreateEventScreen} options={{ title: 'Create Event' }} />
            <Stack.Screen name="AdminUploadPhotos" component={AdminUploadPhotosScreen} options={{ title: 'Upload Photos' }} />
            <Stack.Screen name="AdminProfile" component={AdminProfileScreen} options={{ title: 'Studio Profile' }} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
