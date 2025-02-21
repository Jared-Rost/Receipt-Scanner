import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const RECEIPTS_DIR = `${FileSystem.documentDirectory}receipts`;

interface Receipt {
  id: string;
  text: string;
  date: string;
}

export default function HomeScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [newReceiptText, setNewReceiptText] = useState('');

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(RECEIPTS_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(RECEIPTS_DIR, { intermediates: true });
      }

      const files = await FileSystem.readDirectoryAsync(RECEIPTS_DIR);
      const receiptData = await Promise.all(
        files.map(async (file) => {
          const content = await FileSystem.readAsStringAsync(`${RECEIPTS_DIR}/${file}`);
          return JSON.parse(content) as Receipt;
        })
      );
      setReceipts(receiptData);
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  const saveReceipt = async () => {
    try {
      const receiptId = uuidv4();
      const receipt: Receipt = {
        id: receiptId,
        text: newReceiptText,
        date: new Date().toISOString(),
      };
      const receiptPath = `${RECEIPTS_DIR}/${receiptId}.json`;

      await FileSystem.writeAsStringAsync(receiptPath, JSON.stringify(receipt));

      setReceipts((prevReceipts) => [...prevReceipts, receipt]);
      setNewReceiptText('');
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <View style={styles.receiptItem}>
      <Text style={styles.receiptText}>{item.text}</Text>
      <Text style={styles.receiptDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipts</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter receipt text"
        value={newReceiptText}
        onChangeText={setNewReceiptText}
      />
      <Button title="Save Receipt" onPress={saveReceipt} />
      <FlatList
        data={receipts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.receiptList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  receiptList: {
    marginTop: 16,
  },
  receiptItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  receiptText: {
    fontSize: 16,
  },
  receiptDate: {
    fontSize: 12,
    color: '#888',
  },
});