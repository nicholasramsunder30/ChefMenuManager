
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
};

type MenuContextType = {
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEY = '@chefs_menu_items';

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedItems !== null) {
          setMenuItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadMenuItems();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const saveMenuItems = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(menuItems)
        );
      } catch (error) {
        console.error('Error saving menu items:', error);
      }
    };

    saveMenuItems();
  }, [menuItems, isLoaded]);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((currentItems) => [...currentItems, item]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  return (
    <MenuContext.Provider
      value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used inside MenuProvider');
  }

  return context;
}
