
import { useMenu } from '@/context/MenuContext';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { menuItems, updateMenuItem } = useMenu();

  const item = menuItems.find((dish) => dish.id === id);

  const [dishName, setDishName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [course, setCourse] = useState(item?.course ?? 'Starter');
  const [price, setPrice] = useState(
    item?.price.replace(/^R/i, '') ?? ''
  );

  const handleUpdate = () => {
    if (!item) {
      Alert.alert('Error', 'Menu item could not be found.');
      router.back();
      return;
    }

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

    updateMenuItem({
      id: item.id,
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: `R${priceValue.toFixed(2)}`,
    });

    Alert.alert(
      'Menu Item Updated',
      `${dishName.trim()} has been updated successfully.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Menu Item Not Found</Text>
          <Text style={styles.helperText}>
            This menu item may have been deleted.
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => router.back()}
          >
            <Text style={styles.saveButtonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

          <Text style={styles.title}>Edit Menu Item</Text>
          <Text style={styles.subtitle}>CHEF CHRISTOFFEL</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>DISH NAME *</Text>

          <TextInput
            style={styles.input}
            value={dishName}
            onChangeText={setDishName}
            placeholder="Enter dish name"
            maxLength={60}
            accessibilityLabel="Dish name"
            returnKeyType="next"
          />

          <Text style={styles.label}>DESCRIPTION *</Text>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            maxLength={250}
            accessibilityLabel="Dish description"
          />

          <Text style={styles.label}>COURSE *</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={(value: string) => setCourse(value)}
            >
              <Picker.Item label="Starter" value="Starter" />
              <Picker.Item label="Main Course" value="Main Course" />
              <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
          </View>

          <Text style={styles.label}>PRICE (R) *</Text>

          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="e.g. 85.00"
            keyboardType="decimal-pad"
            maxLength={10}
            accessibilityLabel="Dish price in rand"
          />

          <Text style={styles.helperText}>
            Enter the price in South African Rand (ZAR).
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdate}
            accessibilityRole="button"
            accessibilityLabel="Update menu item"
          >
            <Text style={styles.saveButtonText}>UPDATE MENU ITEM</Text>
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
  notFoundContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
});
