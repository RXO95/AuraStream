
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebaseConfig'; // Import auth

export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  
  useEffect(() => {
    if (auth.currentUser) {
      setUsername(auth.currentUser.displayName);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Display the username here */}
      <Text style={styles.title}>Welcome, {username}! 👋</Text>
      <Text style={styles.subtitle}>
        This is a safe space to talk about what's on your mind.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.buttonText}>Start a Conversation</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FA', },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 18, textAlign: 'center', color: '#6c757d', marginBottom: 40, },
    button: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', },
});