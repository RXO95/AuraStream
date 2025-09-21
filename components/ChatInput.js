import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';

export default function ChatInput({ onSendMessage, loading }) {
  const [input, setInput] = useState("");
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' ? (systemTheme === 'dark' ? darkColors : lightColors) : (themeMode === 'dark' ? darkColors : lightColors);
  
  const handleVoiceInput = () => {
      onSendMessage("This is a simulated voice message.");
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderTopColor: theme.botBubble }]}>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.timestamp}
          value={input}
          onChangeText={setInput}
          multiline
        />
        {/* Conditionally render Voice or Send button */}
        {input.trim().length > 0 ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
            <Ionicons name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceInput}>
            <Ionicons name="mic-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, borderTopWidth: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingHorizontal: 8 },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16 },
  sendButton: { backgroundColor: '#007AFF', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', margin: 4 },
  voiceButton: { padding: 10 },
});
