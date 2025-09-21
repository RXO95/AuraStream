import React, { useState, useEffect, useCallback, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { MenuProvider } from 'react-native-popup-menu';


import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import { lightColors, darkColors } from './styles/theme';


SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function AuthenticatedTabs() {
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const isDarkMode = themeMode === 'auto' ? systemTheme === 'dark' : themeMode === 'dark';
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'ChatTab') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'CalendarTab') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.userBubble,
        tabBarInactiveTintColor: theme.timestamp,
        tabBarStyle: { 
          backgroundColor: theme.background,
          borderTopColor: theme.botBubble,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ChatTab" component={ChatScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="CalendarTab" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}


function AppContent() {
  const { user, loadingAuth } = useContext(AuthContext);
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  
  // This hook pre-loads the icon fonts and tells us when they are ready.
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  const onLayoutRootView = useCallback(async () => {

    if (fontsLoaded && !loadingAuth) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loadingAuth]);

  const isDarkMode = themeMode === 'auto' ? systemTheme === 'dark' : themeMode === 'dark';
  const theme = isDarkMode ? darkColors : lightColors;

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      text: theme.text,
      primary: theme.userBubble,
      card: theme.background,
      border: theme.botBubble,
    },
  };


  if (!fontsLoaded || loadingAuth) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="MainTabs" component={AuthenticatedTabs} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }}/>
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MenuProvider>
          <AppContent />
        </MenuProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}