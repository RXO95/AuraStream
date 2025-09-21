import React, { useContext } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';
import { auth } from '../services/firebaseConfig';

export default function HomeScreen() {
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' 
    ? (systemTheme === 'dark' ? darkColors : lightColors) 
    : (themeMode === 'dark' ? darkColors : lightColors);

  const username = auth.currentUser?.displayName || 'User';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Welcome, {username}</Text>
      <Text style={[styles.subHeader, { color: theme.timestamp }]}>
        This is your space to reflect and grow.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginTop: 10,
  },
});

