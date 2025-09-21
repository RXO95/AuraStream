import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' 
    ? (systemTheme === 'dark' ? darkColors : lightColors) 
    : (themeMode === 'dark' ? darkColors : lightColors);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.timestamp}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor={theme.timestamp}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.userBubble }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={[styles.switchText, { color: theme.userBubble }]}>{"Don't have an account? Sign Up"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40, 
  },
  input: { 
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16, 
  },
  button: { 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  switchText: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 
  },
});

