import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from '../store/useStore';
import { lightTheme, darkTheme } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import SummaryScreen from '../screens/SummaryScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const isDarkMode = useStore(state => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Home')
            iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Add')
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Summary')
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
          paddingTop: 10,
          minHeight: 70 + insets.bottom,  
        },
        headerStyle: {
          backgroundColor: theme.card,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{ title: 'New Transaction' }}
      />
      <Tab.Screen name="Summary" component={SummaryScreen} />
    </Tab.Navigator>
  );
}
