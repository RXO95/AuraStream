// screens/SettingsScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme'; // Import your colors
import { useColorScheme } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  
  // Get the device's current system theme
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' ? (systemTheme === 'dark' ? darkColors : lightColors) : (themeMode === 'dark' ? darkColors : lightColors);

  const options = ['auto', 'light', 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>Appearance</Text>
      <View style={[styles.optionsContainer, { backgroundColor: theme.inputBackground }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              themeMode === option && { backgroundColor: theme.background }
            ]}
            onPress={() => setThemeMode(option)}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.linkButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  linkButton: {
      marginTop: 30,
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#007AFF', // Or use theme.userBubble
  },
  linkButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600'
  }
});