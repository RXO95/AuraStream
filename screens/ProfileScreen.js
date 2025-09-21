import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';
import { auth, db } from '../services/firebaseConfig';
import { collection, query, getDocs, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' 
    ? (systemTheme === 'dark' ? darkColors : lightColors) 
    : (themeMode === 'dark' ? darkColors : lightColors);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  const handleClearAllData = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    Alert.alert(
      "Clear All Your Data?",
      "This will permanently delete all your chat messages and scheduled wellness activities. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All Data",
          style: "destructive",
          onPress: async () => {
            try {
              const chatsRef = collection(db, 'users', userId, 'chats');
              const calendarRef = collection(db, 'users', userId, 'calendarEvents');
              
              const chatsSnapshot = await getDocs(query(chatsRef));
              const calendarSnapshot = await getDocs(query(calendarRef));

              const batch = writeBatch(db);
              chatsSnapshot.forEach((doc) => batch.delete(doc.ref));
              calendarSnapshot.forEach((doc) => batch.delete(doc.ref));
              
              await batch.commit();
              
              Alert.alert("Success", "All your chat and calendar data has been cleared.");
            } catch (error) {
              console.error("Error clearing all data: ", error);
              Alert.alert("Error", "Could not clear your data. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    navigation.navigate('Login');
    setTimeout(() => {
      signOut(auth).catch(error => {
        console.error("Sign out error", error);
        Alert.alert("Error", "Could not sign out.");
      });
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.header, { color: theme.text }]}>Profile & Settings</Text>
        
        {user && (
          <View style={[styles.profileCard, { backgroundColor: theme.inputBackground }]}>
            <Text style={[styles.infoLabel, { color: theme.timestamp }]}>Username</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{user.displayName}</Text>
            <Text style={[styles.infoLabel, { color: theme.timestamp }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{user.email}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.userBubble }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.userBubble }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Appearance Settings</Text>
        </TouchableOpacity>

        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.destructiveButton}
          onPress={handleClearAllData}
        >
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.destructiveButton}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  content: { padding: 20, },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, },
  profileCard: { padding: 20, borderRadius: 12, marginBottom: 20, },
  infoLabel: { fontSize: 14, opacity: 0.8, },
  infoValue: { fontSize: 18, fontWeight: '500', marginBottom: 15, },
  button: { padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15, },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 20, },
  destructiveButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
});

