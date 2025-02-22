import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const RECEIPTS_DIR = `${FileSystem.documentDirectory}receipts`;

interface Receipt {
  id: string;
  text: string;
  store: string;
  amount: string;
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
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: '1', text: 'Groceries', store: 'Walmart', amount: '$45.23', date: '2025-02-22', category: 'grocery' },
    { id: '2', text: 'Dinner at McDonalds', store: 'McDonalds', amount: '$12.99', date: '2025-02-21', category: 'dining' },
    { id: '3', text: 'XHM4', store: 'Best Buy', amount: '$89.99', date: '2025-02-20', category: 'technology' },
    { id: '4', text: 'Movie Ticket', store: 'Cineplex', amount: '$14.50', date: '2025-02-19', category: 'entertainment' },
  ]);
  const [newReceiptText, setNewReceiptText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
          <View style={styles.card}>
            <Text style={styles.storeName}>{item.store}</Text>
            <Text style={styles.receiptText}>{item.text}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
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
  filterBar: {
    marginBottom: 10,
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  receiptText: {
    fontSize: 14,
    color: '#555',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008000',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});

