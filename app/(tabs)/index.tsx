import { useMenu } from '@/context/MenuContext';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MenuManagerScreen() {
  const { menuItems } = useMenu();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Menu Manager</Text>
          <Text style={styles.subtitle}>CHEF CHRISTOFFEL</Text>
        </View>

        <View style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            ACTIVE DISHES ({menuItems.length})
          </Text>
          <Text style={styles.currency}>CURRENCY: ZAR (R)</Text>
        </View>

        {menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Menu Items</Text>
            <Text style={styles.emptyText}>
              No menu items have been added yet.
            </Text>
          </View>
        ) : (
          menuItems.map((item) => (
            <MenuItem
              key={item.id}
              name={item.name}
              course={item.course}
              description={item.description}
              price={item.price}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-item')}
        >
          <Text style={styles.addButtonText}>+ Add Menu Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  name,
  course,
  description,
  price,
}: {
  name: string;
  course: string;
  description: string;
  price: string;
}) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.itemTop}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      <Text style={styles.course}>{course}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsText: {
    fontSize: 20,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  currency: {
    fontSize: 10,
    opacity: 0.5,
  },

  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
  },

  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
  },

  course: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
    opacity: 0.6,
  },

  description: {
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
    opacity: 0.7,
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.6,
    textAlign: 'center',
  },

  addButton: {
    backgroundColor: '#111111',
    paddingVertical: 17,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});