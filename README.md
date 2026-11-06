
# Chef's Menu Manager

## Project Overview

Chef's Menu Manager is a React Native mobile application developed for Chef Christoffel. The application allows the chef to manage restaurant menu items through a simple and user-friendly interface.

The application was developed using React Native, Expo and TypeScript.

## Features

- Add new menu items.
- Edit existing menu items.
- Delete menu items with confirmation.
- Search menu items by dish name.
- Filter menu items by course.
- Clear search and filters.
- Display menu statistics.
- Calculate the average price of menu items.
- Display the total number of dishes and the number of items in each course.
- Save menu data locally using AsyncStorage.
- Validate user input and display feedback messages.

## Technologies Used

- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- AsyncStorage
- Visual Studio Code
- Android Studio Emulator
- Git and GitHub

## Installation and Setup

1. Clone the GitHub repository.
2. Open the project folder in Visual Studio Code.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npx expo start
   ```

5. Press `a` to open the application in the Android emulator.

## Change Log

### Changes from Part 2 to Final PoE

**1. Menu Management**
- Added functionality to edit existing menu items.
- Added functionality to delete menu items.
- Added confirmation messages when deleting items.
- Ensured changes are reflected immediately.

**2. Search and Filtering**
- Added search functionality using dish names.
- Added filtering by Starter, Main Course and Dessert.
- Added an option to clear search and filters.

**3. Menu Statistics**
- Added a total menu item counter.
- Added average menu price calculation.
- Added individual counters for starters, main courses and desserts.

**4. Data Storage**
- Integrated AsyncStorage to save menu items locally.
- Added functionality to load saved menu items when the application starts.

**5. Code Organisation and Refactoring**
- Introduced reusable StatCard and MenuItemCard components.
- Improved code organisation and naming.
- Used reusable functions for navigation and menu management.

**6. Validation and User Feedback**
- Added required-field validation.
- Added price validation to prevent invalid or negative prices.
- Restricted prices to two decimal places.
- Added clear success and error messages.
- Improved keyboard handling and accessibility labels.
- Added cancel options to the Add and Edit screens.

## Developer

Nicholas Ramsunder

## Repository

GitHub: https://github.com/nicholasramsunder30/ChefMenuManager.git
