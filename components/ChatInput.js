// components/ChatInput.js
import React, { useState, useContext } from 'react'; // 1. Import useContext
import { View, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext'; // 2. Import the ThemeContext
import { lightColors, darkColors } from '../styles/theme'; // 3. Import the colors

// The component no longer accepts 'theme' as a prop
export default function ChatInput({ onSendMessage, loading }) {
  const [input, setInput] = useState("");

  // 4. Add this block to get the theme from the global context
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' 
    ? (systemTheme === 'dark' ? darkColors : lightColors) 
    : (themeMode === 'dark' ? darkColors : lightColors);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    // Now the 'theme' variable exists and can be used here
    <View style={[styles.container, { backgroundColor: theme.background, borderTopColor: theme.botBubble }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
        placeholder="Type your message..."
        placeholderTextColor={theme.timestamp}
        value={input}
        onChangeText={setInput}
        multiline
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    padding: 10, 
    alignItems: 'center', 
    borderTopWidth: 1 
  },
  input: { 
    flex: 1, 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginRight: 10, 
    fontSize: 16 
  },
  sendButton: { 
    backgroundColor: '#007AFF', 
    borderRadius: 25, 
    width: 50, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});