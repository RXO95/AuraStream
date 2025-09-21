import React, { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';
import { View, Text, StyleSheet, Image } from "react-native";

const botAvatar = require('../assets/bot-avatar.png'); 

export default function MessageBubble({ message }) {
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' ? (systemTheme === 'dark' ? darkColors : lightColors) : (themeMode === 'dark' ? darkColors : lightColors);

  const isBot = message.isBot;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  
  const messageText = (typeof message.text === 'string') ? message.text : '[Invalid message format]';

  return (
    <View style={[styles.messageRow, isBot ? styles.alignLeft : styles.alignRight]}>
      {isBot && <Image source={botAvatar} style={styles.avatar} />}
      
      <View style={styles.messageContainer}>
        <View style={[
          styles.bubble, 
          isBot ? { backgroundColor: theme.botBubble } : { backgroundColor: theme.userBubble },
          isBot ? styles.botBubbleShape : styles.userBubbleShape
        ]}>
          <Text style={[styles.baseText, isBot ? { color: theme.botText } : { color: theme.userText }]}>
            {messageText}
          </Text>
        </View>
        <Text style={[
          styles.timestamp,
          { color: theme.timestamp }, 
          isBot ? styles.timestampBot : styles.timestampUser
        ]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: { flexDirection: 'row', marginVertical: 8, alignItems: 'flex-end', paddingHorizontal: 10, },
  alignLeft: { justifyContent: 'flex-start' },
  alignRight: { justifyContent: 'flex-end' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  messageContainer: { maxWidth: '80%' },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  userBubbleShape: { borderBottomRightRadius: 5 },
  botBubbleShape: { borderBottomLeftRadius: 5 },
  baseText: { fontSize: 16, lineHeight: 22 },
  timestamp: { fontSize: 11, marginTop: 4 },
  timestampBot: { alignSelf: 'flex-start', marginLeft: 5 },
  timestampUser: { alignSelf: 'flex-end', marginRight: 5 },
});

