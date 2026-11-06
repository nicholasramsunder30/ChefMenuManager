
import { MenuItem, useMenu } from '@/context/MenuContext';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Reusable statistics card
type StatCardProps = {
  label: string;
  value: string | number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Reusable menu item card
type MenuItemCardProps = {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
};

function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.itemTop}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>EDIT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main menu manager screen
export default function MenuManagerScreen() {
  const { menuItems, deleteMenuItem } = useMenu();

  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  // Calculate menu statistics
  const statistics = useMemo(() => {
    const prices = menuItems
      .map((item) => Number(item.price.replace(/[^\d.]/g, '')))
      .filter((price) => Number.isFinite(price));

    const average =
      prices.length > 0
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : 0;

    return {
      total: menuItems.length,
      average,
      starters: menuItems.filter((item) => item.course === 'Starter').length,
      mains: menuItems.filter((item) => item.course === 'Main Course').length,
      desserts: menuItems.filter((item) => item.course === 'Dessert').length,
    };
  }, [menuItems]);

  // Search and filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());

      const matchesCourse =
        selectedCourse === 'All' || item.course === selectedCourse;

      return matchesName && matchesCourse;
    });
  }, [menuItems, searchText, selectedCourse]);

  // Reset search and filters
  const clearFilters = () => {
    setSearchText('');
    setSelectedCourse('All');
  };

  // Delete a menu item after confirmation
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMenuItem(id);
            Alert.alert('Deleted', `${name} has been removed.`);
          },
        },
      ]
    );
  };

  // Navigate to the edit screen
  const handleEdit = (id: string) => {
    router.push({
      pathname: '/edit-item',
      params: { id },
    });
  };

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

        {/* Menu statistics */}
        <Text style={styles.dashboardTitle}>MENU OVERVIEW</Text>

        <View style={styles.statsGrid}>
          <StatCard label="TOTAL DISHES" value={statistics.total} />
          <StatCard
            label="AVERAGE PRICE"
            value={`R${statistics.average.toFixed(2)}`}
          />
          <StatCard label="STARTERS" value={statistics.starters} />
          <StatCard label="MAIN COURSES" value={statistics.mains} />
          <StatCard label="DESSERTS" value={statistics.desserts} />
        </View>

        {/* Search */}
        <Text style={styles.filterHeading}>FIND A DISH</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by dish name..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          accessibilityLabel="Search menu items by name"
        />

        {/* Course filter */}
        <Text style={styles.filterHeading}>FILTER BY COURSE</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(value: string) => setSelectedCourse(value)}
          >
            <Picker.Item label="All Courses" value="All" />
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearFilters}
          accessibilityRole="button"
          accessibilityLabel="Clear search and filters"
        >
          <Text style={styles.clearButtonText}>
            CLEAR SEARCH AND FILTER
          </Text>
        </TouchableOpacity>

        <Text style={styles.resultsText}>
          Showing {filteredItems.length} of {menuItems.length} dishes
        </Text>

        {/* Menu item list */}
        {menuItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Menu Items</Text>
            <Text style={styles.emptyText}>
              No menu items have been added yet. Add your first dish below.
            </Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>
              Try another dish name or clear your filters.
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          ))
        )}

        {/* Add menu item */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-item')}
          accessibilityRole="button"
          accessibilityLabel="Add a new menu item"
        >
          <Text style={styles.addButtonText}>+ Add Menu Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Screen styles
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
    marginBottom: 20,
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
  dashboardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginTop: 6,
    opacity: 0.55,
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  clearButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#555555',
  },
  resultsText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 14,
    marginTop: 5,
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#EFEFEA',
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222222',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FCE9E7',
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B42318',
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
