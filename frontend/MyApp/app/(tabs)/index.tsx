import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const RECEIPTS_DIR = `${FileSystem.documentDirectory}receipts`;

interface Receipt {
  id: string;
  text: string;
  date: string;
  category: string;
}

const categories = [
  { name: 'grocery', color: '#FF6347' },
  { name: 'dining', color: '#FFD700' },
  { name: 'retail', color: '#006400' },
  { name: 'entertainment', color: '#1E90FF' },
  { name: 'technology', color: '#8A2BE2' },
  { name: 'personal care', color: '#FF69B4' },
  { name: 'other', color: '#A9A9A9' },
];

export default function HomeScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [newReceiptText, setNewReceiptText] = useState('');
  const [newReceiptCategory, setNewReceiptCategory] = useState(categories[0].name);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
      console.error(error);
    }
  };

  const addReceipt = async () => {
    const newReceipt: Receipt = {
      id: uuidv4(),
      text: newReceiptText,
      date: new Date().toISOString(),
      category: newReceiptCategory,
    };

    const filePath = `${RECEIPTS_DIR}/${newReceipt.id}.json`;
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(newReceipt));
    setReceipts([...receipts, newReceipt]);
    setNewReceiptText('');
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filteredReceipts = receipts.filter((receipt) =>
    selectedCategories.length === 0 || selectedCategories.includes(receipt.category)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New receipt text"
        value={newReceiptText}
        onChangeText={setNewReceiptText}
      />
      <Button title="Add Receipt" onPress={addReceipt} />
      <ScrollView horizontal style={styles.filterBar}>
        <View style={styles.filterBarContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.filterButton,
                { backgroundColor: selectedCategories.length === 0 || selectedCategories.includes(category.name) ? category.color : '#D3D3D3' },
                selectedCategories.includes(category.name) && styles.selectedFilter,
              ]}
              onPress={() => toggleCategory(category.name)}
            >
              <Text style={styles.filterButtonText}>
                {category.name} ({receipts.filter((r) => r.category === category.name).length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <FlatList
        data={filteredReceipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.receipt}>
            <Text>{item.text}</Text>
            <Text>{item.date}</Text>
            <Text>{item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryPicker: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    borderRadius: 15,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: 'black',
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    borderRadius: 15,
    height: 20,
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: 'black',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  receipt: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});