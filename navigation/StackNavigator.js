import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();


export const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'AuraStream' }} />
    {/* Screens you can navigate to from the Chat screen */}
  </Stack.Navigator>
);

export const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Calendar" component={CalendarScreen} />
  </Stack.Navigator>
);

export const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);


export const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
);
