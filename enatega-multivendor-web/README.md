# Converting PWA to iOS Project with Capacitor

These instructions will guide you through converting your existing Progressive Web App (PWA) into an iOS project that can be run on Xcode.

## Prerequisites

*   Node.js and npm installed
*   Xcode installed

## Steps

1.  **Install Capacitor:**

    ```bash
    npm install -g @capacitor/cli @capacitor/core
    ```

2.  **Create a Capacitor Project:**

    ```bash
    mkdir ios-app
    cd ios-app
    npm init -y
    npm install @capacitor/ios @capacitor/cli @capacitor/core
    npx cap init --web-dir ../public --app-name "YourAppName" --appId "com.example.yourapp"
    ```

    Replace `"YourAppName"` with the desired name of your iOS app.
    Replace `"com.example.yourapp"` with a unique bundle identifier for your app.

3.  **Copy Web App Assets:**

    Copy the contents of your PWA's `public` directory (or whichever directory contains your web app's assets) into the `ios-app/www` directory.

4.  **Add iOS Platform:**

    ```bash
    cd ios-app
    npx cap add ios
    ```

5.  **Build iOS Project:**

    ```bash
    npx cap sync ios
    npx cap open ios
    ```

    This will open the project in Xcode.

6.  **Run in Xcode:**

    In Xcode, select your target device (simulator or physical device) and run the project.

## Notes

*   You may need to configure signing certificates and provisioning profiles in Xcode to run the app on a physical device.
*   This process creates a basic iOS wrapper around your PWA. You may need to add additional native functionality using Capacitor plugins.
