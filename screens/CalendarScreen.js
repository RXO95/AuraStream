import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Button,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';
import { auth, db } from '../services/firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);

  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' 
    ? (systemTheme === 'dark' ? darkColors : lightColors) 
    : (themeMode === 'dark' ? darkColors : lightColors);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const calendarRef = collection(db, 'users', userId, 'calendarEvents');
    const q = query(calendarRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    });

    return () => unsubscribe(); 
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button onPress={() => setModalVisible(true)} title="Add" />
          <View style={{ width: 10 }} />
          <Button
            onPress={() => {
              setSelectionMode(!selectionMode);
              setSelectedEvents([]);
            }}
            title={selectionMode ? "Cancel" : "Select"}
          />
        </View>
      ),
    });
  }, [navigation, selectionMode]);

  const handleToggleComplete = async (eventId, currentStatus) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const eventRef = doc(db, 'users', userId, 'calendarEvents', eventId);
    await updateDoc(eventRef, {
      completed: !currentStatus
    });
  };

  const handleSelectEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };
  
  const handleAddNewEvent = async () => {
    if (!newEventTitle.trim()) {
        Alert.alert("Error", "Please enter an activity title.");
        return;
    }
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const calendarRef = collection(db, 'users', userId, 'calendarEvents');
    await addDoc(calendarRef, {
        title: newEventTitle,
        date: newEventDate,
        completed: false,
        createdAt: serverTimestamp(),
    });

    
    setNewEventTitle('');
    setNewEventDate(new Date().toISOString().split('T')[0]);
    setModalVisible(false);
  };

  const handleDeleteSelected = () => {
    const userId = auth.currentUser?.uid;
    if (!userId || selectedEvents.length === 0) return;

    Alert.alert(
      "Delete Selected Items?",
      `Are you sure you want to delete ${selectedEvents.length} item(s)? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const batch = writeBatch(db);
              selectedEvents.forEach(eventId => {
                const eventRef = doc(db, 'users', userId, 'calendarEvents', eventId);
                batch.delete(eventRef);
              });
              await batch.commit();
              setSelectionMode(false);
              setSelectedEvents([]);
            } catch (error) {
              console.error("Error deleting events: ", error);
              Alert.alert("Error", "Could not delete the selected items.");
            }
          },
        },
      ]
    );
  };

  const renderEventItem = ({ item }) => (
    <View style={[styles.eventItem, { backgroundColor: theme.inputBackground }]}>
      <TouchableOpacity 
        style={styles.checkButton}
        onPress={() => selectionMode ? handleSelectEvent(item.id) : handleToggleComplete(item.id, item.completed)}
      >
        {selectionMode ? (
          <Ionicons 
            name={selectedEvents.includes(item.id) ? "checkmark-circle" : "ellipse-outline"} 
            size={28} 
            color={selectedEvents.includes(item.id) ? '#007AFF' : theme.timestamp} 
          />
        ) : (
          <Ionicons 
            name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
            size={28} 
            color={item.completed ? '#34C759' : theme.timestamp} 
          />
        )}
      </TouchableOpacity>
      <View>
        <Text style={[
          styles.eventTitle, 
          { color: theme.text },
          item.completed && styles.completedText
        ]}>
          {item.title}
        </Text>
        <Text style={[styles.eventDate, { color: theme.timestamp }]}>
          Scheduled for: {item.date}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* --- This is the new Modal for adding events --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.inputBackground }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>Add New Activity</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Activity Title (e.g., 'Go for a walk')"
              placeholderTextColor={theme.timestamp}
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={theme.timestamp}
              value={newEventDate}
              onChangeText={setNewEventDate}
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3B30" />
              <Button title="Save" onPress={handleAddNewEvent} />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={[styles.header, { color: theme.text }]}>Your Wellness Plan</Text>
      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.timestamp }]}>
            No activities scheduled yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
        />
      )}
      {selectionMode && selectedEvents.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.botBubble }]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteSelected}
          >
            <Text style={styles.deleteButtonText}>Delete ({selectedEvents.length})</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', margin: 20 },
  eventItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginHorizontal: 20, marginBottom: 10 },
  checkButton: { marginRight: 15 },
  eventTitle: { fontSize: 16, fontWeight: '500' },
  completedText: { textDecorationLine: 'line-through', opacity: 0.5 },
  eventDate: { fontSize: 12, marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: '500', textAlign: 'center' },
  footer: { padding: 20, borderTopWidth: 1 },
  deleteButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 20, borderRadius: 12 },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

