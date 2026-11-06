
import { useMenu } from '@/context/MenuContext';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddItemScreen() {
  const { addMenuItem } = useMenu();

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    // Validate required fields
    if (!dishName.trim()) {
      Alert.alert('Missing Dish Name', 'Please enter the name of the dish.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for the dish.');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Missing Price', 'Please enter the price of the dish.');
      return;
    }

    // Validate price format
    const priceValue = Number(price.trim());

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid price greater than R0.00.'
      );
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {
      Alert.alert(
        'Invalid Price Format',
        'Please enter a price with no more than two decimal places.'
      );
      return;
    }

    // Create the new menu item
    const newItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: `R${priceValue.toFixed(2)}`,
    };

    addMenuItem(newItem);

    // Confirm successful addition
    Alert.alert(
      'Menu Item Added',
      `${dishName.trim()} has been added successfully.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add Menu Item</Text>
          <Text style={styles.subtitle}>CHEF CHRISTOFFEL</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>DISH NAME *</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={dishName}
            onChangeText={setDishName}
            maxLength={60}
            accessibilityLabel="Dish name"
            returnKeyType="next"
          />

          <Text style={styles.label}>DESCRIPTION *</Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter dish description"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={250}
            accessibilityLabel="Dish description"
          />

          <Text style={styles.label}>COURSE *</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={(itemValue: string) => setCourse(itemValue)}
            >
              <Picker.Item label="Starter" value="Starter" />
              <Picker.Item label="Main Course" value="Main Course" />
              <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
          </View>

          <Text style={styles.label}>PRICE (R) *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 85.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            maxLength={10}
            accessibilityLabel="Dish price in rand"
          />

          <Text style={styles.helperText}>
            Enter the price in South African Rand (ZAR).
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save menu item"
          >
            <Text style={styles.saveButtonText}>SAVE MENU ITEM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 25,
  },
  backButton: {
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 5,
    opacity: 0.6,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  descriptionInput: {
    height: 110,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#111111',
    paddingVertical: 17,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
