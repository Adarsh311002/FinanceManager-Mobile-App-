import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './src/navigation/BottomTabs'; 
import OnboardingScreen from './src/screens/OnboardingScreen'; 
import { useStore } from './src/store/useStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const userName = useStore(state => state.userName);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userName ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={BottomTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
