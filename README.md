# Enatega Multi-vendor Food Delivery Solution - Setup Guide

This guide provides detailed instructions for setting up and running each component of the Enatega Multi-vendor Food Delivery Solution.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Enatega Admin Dashboard (Next.js)](#enatega-admin-dashboard-nextjs)
- [Enatega Customer Web (React.js)](#enatega-customer-web-reactjs)
- [Enatega Customer App (React Native)](#enatega-customer-app-react-native)
- [Enatega Rider App (React Native)](#enatega-rider-app-react-native)
- [Enatega Restaurant App (React Native)](#enatega-restaurant-app-react-native)
- [Building Development Versions](#building-development-versions)

## Prerequisites

Before you begin, ensure that you have the following installed:
- Node.js (version 18-20)
- npm or yarn
- Expo CLI (for mobile apps)
- EAS CLI (for development builds)

## Enatega Admin Dashboard (Next.js)

The admin dashboard allows you to manage restaurants, orders, riders, and more.

```bash
# Navigate to the admin dashboard directory
cd enatega-multivendor-admin

# Install dependencies
npm install

# Start the development server
npm run dev
```

After running these commands, open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the admin dashboard. You can also CTRL+click on the localhost link that appears in your terminal.

## Enatega Customer Web (React.js)

The customer web application allows users to browse restaurants and place orders through a web browser.

```bash
# Navigate to the customer web directory
cd enatega-multivendor-web

# Install dependencies
npm install

# Start the development server
npm start
```

After running these commands, the application will be available at [http://localhost:3000](http://localhost:3000) in your web browser.

## Enatega Customer App (React Native)

The customer mobile application allows users to browse restaurants and place orders on their mobile devices.

```bash
# Navigate to the customer app directory
cd enatega-multivendor-app

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

## Enatega Rider App (React Native)

The rider app allows delivery personnel to manage and complete deliveries.

```bash
# Navigate to the rider app directory
cd enatega-multivendor-rider

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

## Enatega Restaurant App (React Native)

The restaurant app allows restaurant owners to manage orders and their menu.

```bash
# Navigate to the restaurant app directory
cd enatega-multivendor-restaurant

# Install dependencies
npm install

# Start the Expo development server
npx expo start -c
# OR
npm start -c
```

### Testing on a Physical Device with Expo Go

1. Press `s` in the terminal to switch to Expo Go mode
2. Scan the QR code displayed in the terminal:
   - Android: Open the Expo Go app and scan the QR code
   - iOS: Use the device's camera app to scan the QR code

## Building Development Versions

For all mobile apps (Customer, Rider, and Restaurant), you can create development builds using EAS Build.

### Configure EAS Build

```bash
# From the app directory (customer, rider, or restaurant)
eas build:configure
```

Select your desired platform:
- android
- ios
- all

### Build for Android

```bash
eas build --platform android --profile development
```

This will create an APK file that you can install directly on your Android device.

### Build for iOS

```bash
eas build --platform ios --profile development
```

For iOS simulator builds, modify the `eas.json` file to include:

```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "channel": "development",
  "ios": {
    "simulator": true
  },
  "android": {
    "buildType": "apk"
  }
}
```

Then run:

```bash
eas build --platform ios --profile development
```

## Additional Resources

For more detailed information, please refer to the [official documentation](https://enatega.com/multivendor-documentation/).

If you encounter any issues during setup, please check the [GitHub repository](https://github.com/Ninjas-Code-official/Enatega-Multivendor-Food-Delivery-Solution) or contact our support team.
