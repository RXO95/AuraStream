// screens/ChatScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  // No longer need KeyboardAvoidingView or Platform
  useColorScheme,
} from "react-native";
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';
import { getGeminiReply } from '../services/gemini'; 
import { auth, db } from '../services/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' ? (systemTheme === 'dark' ? darkColors : lightColors) : (themeMode === 'dark' ? darkColors : lightColors);

  // ... (useEffect and sendMessage functions remain exactly the same)
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const messagesRef = collection(db, 'users', userId, 'chats');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const messagesRef = collection(db, 'users', userId, 'chats');
    const userMsgForUI = { id: Date.now().toString(), text: userInput, isBot: false, createdAt: new Date() };
    setMessages(prevMessages => [userMsgForUI, ...prevMessages]);
    setLoading(true);
    await addDoc(messagesRef, { text: userInput, isBot: false, createdAt: serverTimestamp() });
    try {
      const historyForAPI = messages.slice(0, 10).reverse().map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));
      if (historyForAPI.length > 0 && historyForAPI[0].role !== 'user') {
        historyForAPI.shift();
      }
      const reply = await getGeminiReply(userInput, historyForAPI);
      await addDoc(messagesRef, { text: reply, isBot: true, createdAt: serverTimestamp() });
    } catch (err) {
      console.error("Error fetching bot reply:", err);
      await addDoc(messagesRef, { text: "I'm having trouble connecting. Please try again.", isBot: true, createdAt: serverTimestamp() });
    } finally {
      setLoading(false);
    }
  };

  return (
    // The structure is now much simpler without KeyboardAvoidingView
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.timestamp }]}>
              Aura is always here to help :)
            </Text>
          </View>
        ) : (
          <FlatList
            inverted
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
          />
        )}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={[styles.loadingText, { color: theme.text }]}>Bot is typing...</Text>
          </View>
        )}
      </View>
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
  },
});