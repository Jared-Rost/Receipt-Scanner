import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';

const categories = [
  { name: 'grocery', color: '#FF6347' },
  { name: 'dining', color: '#FFD700' },
  { name: 'retail', color: '#006400' },
  { name: 'entertainment', color: '#1E90FF' },
  { name: 'technology', color: '#8A2BE2' },
  { name: 'personal care', color: '#FF69B4' },
  { name: 'other', color: '#A9A9A9' },
];

interface Receipt {
  id: string;
  text: string;
  store: string;
  amount: string;
  date: string;
  category: string;
  products: string[];
}

export default function HomeScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: '1', text: 'Groceries', store: 'Walmart', amount: '$45.23', date: '2025-02-22', category: 'grocery', products: ['Milk', 'Bread', 'Eggs', 'Butter'] },
    { id: '2', text: 'Happy Meal', store: 'McDonalds', amount: '$12.99', date: '2025-02-21', category: 'dining', products: ['Burger', 'Fries', 'Coke'] },
    { id: '3', text: 'XHM4', store: 'Best Buy', amount: '$89.99', date: '2025-02-20', category: 'technology', products: ['Headphones'] },
    { id: '4', text: 'Movie Ticket', store: 'Cineplex', amount: '$14.50', date: '2025-02-19', category: 'entertainment', products: ['Movie Ticket'] },
    { id: '5', text: 'Bowling', store: 'Rec Room', amount: '$20.50', date: '2025-01-15', category: 'entertainment', products: ['Bowling Fee'] },
    { id: '6', text: 'Dinner', store: 'Earls', amount: '$40.50', date: '2025-01-14', category: 'dining', products: ['Steak', 'Wine', 'Dessert'] }
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [splitWith, setSplitWith] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleExpand = (id: string) => {
    setSelectedReceipt(selectedReceipt === id ? null : id);
  };

  const speakReceipt = (receipt: Receipt) => {
    const text = `Receipt from ${receipt.store}. Total amount ${receipt.amount}. Purchased items: ${receipt.products.join(', ')}. Date: ${receipt.date}`;
    Speech.speak(text);
  };

  const shareReceipt = async (receipt: Receipt) => {
    const content = `Receipt from ${receipt.store}\nAmount: ${receipt.amount}\nDate: ${receipt.date}\nProducts: ${receipt.products.join(', ')}`;
    await Sharing.shareAsync(`data:text/plain,${encodeURIComponent(content)}`);
  };

  const splitWithPayPal = (receipt: Receipt) => {
    const paypalLink = `https://www.paypal.com/send?recipient_email=email@example.com&amount=${parseFloat(receipt.amount.replace('$', '')) / splitWith}`;
    // Open the PayPal link to initiate payment splitting
    Linking.openURL(paypalLink);
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
          <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.card}>
            <Text style={styles.storeName}>{item.store}</Text>
            <Text style={styles.receiptText}>{item.text}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>

            {selectedReceipt === item.id && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>Category: {item.category}</Text>
                <Text style={styles.expandedText}>Products:</Text>
                {item.products.map((product, index) => (
                  <Text key={index} style={styles.productItem}>• {product}</Text>
                ))}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => speakReceipt(item)}>
                    <Text style={styles.buttonText}>Read Aloud</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => shareReceipt(item)}>
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => splitWithPayPal(item)}>
                    <Text style={styles.buttonText}>Split with PayPal</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.splitContainer}>
                  <Text>Split with:</Text>
                  <View style={styles.splitButtons}>
                    <TouchableOpacity
                      style={styles.splitButton}
                      onPress={() => setSplitWith(Math.max(1, splitWith - 1))}
                    >
                      <Text style={styles.splitButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.counterText}>{splitWith}</Text>

                    <TouchableOpacity
                      style={styles.splitButton}
                      onPress={() => setSplitWith(splitWith + 1)}
                    >
                      <Text style={styles.splitButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text>Each person pays: ${(parseFloat(item.amount.replace('$', '')) / splitWith).toFixed(2)}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
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
  expandedContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  expandedText: {
    fontSize: 12,
    color: '#444',
  },
  productItem: {
    fontSize: 12,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  splitContainer: {
    marginTop: 10,
    alignItems: 'center',
  },

  splitButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  splitButton: {
    backgroundColor: '#008000',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  splitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },

  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
