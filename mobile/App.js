import React from 'react';
import 'react-native-gesture-handler';

import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
