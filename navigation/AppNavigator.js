import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { collection, query, getDocs, writeBatch } from 'firebase/firestore';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from '../screens/WelcomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const handleClearHistory = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  Alert.alert(
    "Clear Chat History?",
    "This action cannot be undone. All messages will be permanently deleted.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            const messagesRef = collection(db, 'users', userId, 'chats');
            const q = query(messagesRef);
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            await batch.commit();
            
            Alert.alert("Success", "Chat history has been cleared.");
          } catch (error) {
            console.error("Error clearing history: ", error);
            Alert.alert("Error", "Could not clear chat history.");
          }
        },
      },
    ]
  );
};


export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ navigation }) => ({
          title: 'Your Therapy Bot',
          headerLeft: null, 
          headerRight: () => (
            <Menu>
              <MenuTrigger>
                <Ionicons 
                  name="ellipsis-vertical" 
                  size={24} 
                  color="black"
                  style={{ marginRight: 15 }} 
                />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => navigation.navigate('Settings')}>
                  <Text style={styles.menuText}>Settings</Text>
                </MenuOption>
                
                <MenuOption onSelect={handleClearHistory}>
                  <Text style={styles.menuText}>Clear History</Text>
                </MenuOption>

                <View style={styles.divider} />
                {/* --- THIS IS THE MORE ROBUST SIGN OUT LOGIC --- */}
                <MenuOption onSelect={() => {
                  // 1. Navigate away from the protected screen first.
                  navigation.navigate('Login');
                  
                  // 2. Use a short timeout to allow the screen to unmount before signing out.
                  setTimeout(() => {
                    signOut(auth).catch(error => {
                      console.error("Sign out error", error);
                    });
                  }, 50); // 50ms is enough time
                }}>
                  <Text style={[styles.menuText, { color: 'red' }]}>Sign Out</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ),
        })} 
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  menuText: {
    fontSize: 16,
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
});
