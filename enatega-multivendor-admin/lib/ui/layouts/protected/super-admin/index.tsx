/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// Core
import { useContext, useEffect } from 'react';
import { initialize, isFirebaseSupported } from '@/firebase';
import { getToken, onMessage } from 'firebase/messaging';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Components
import AppTopbar from '@/lib/ui/screen-components/protected/layout/super-admin-layout/app-bar';
import SuperAdminSidebar from '@/lib/ui/screen-components/protected/layout/super-admin-layout/side-bar';

// Interface
import { IProvider, LayoutContextProps } from '@/lib/utils/interfaces';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// GraphQl
import { UPLOAD_TOKEN } from '@/lib/api/graphql/queries/token';
import { useApolloClient } from '@apollo/client';

const Layout = ({ children }: IProvider) => {
  // Context
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  // Hooks
  const client = useApolloClient();
  const { user } = useUserContext();
  const {
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MSG_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_VAPID_KEY,
  } = useConfiguration();

  // Side Effects
  useEffect(() => {
    if (!user) return;

    const initializeFirebase = async () => {
      if (await isFirebaseSupported()) {
        const messaging = initialize({
          FIREBASE_AUTH_DOMAIN,
          FIREBASE_KEY,
          FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET,
          FIREBASE_MSG_SENDER_ID,
          FIREBASE_APP_ID,
          FIREBASE_MEASUREMENT_ID,
        });

        if (!messaging) {
          console.error('🔥 Firebase Messaging failed to initialize.');
          return;
        }

        // Request Notification Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('🚨 Notification permission denied!');
          return;
        }

        // Retrieve the token
        getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
          .then((token) => {
            if (!token) {
              console.warn('🚨 No push token received');
              return;
            }

            console.log('✅ Push Token:', token);
            localStorage.setItem('messaging-token', token);

            client
              .mutate({
                mutation: UPLOAD_TOKEN,
                variables: { id: user?.userId, pushToken: token },
              })
              .then(() => console.log('📡 Token uploaded successfully'))
              .catch((error) => console.error('🔥 Upload token error:', error));
          })
          .catch((err) => console.error('❌ getToken error:', err));

        // Handle foreground notifications
        onMessage(messaging, (payload) => {
          console.log('📩 Foreground Notification:', payload);
          if (!payload.notification) return;
          const { title, body } = payload.notification;

          const notification = new Notification(title ?? '', {
            body,
          });

          notification.onclick = () => {
            window.open('https://multivendor-admin.ninjascode.com/dashboard');
          };
        });
      }
    };

    initializeFirebase();
  }, [user]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker Registered:', registration);
        })
        .catch((err) => console.error('❌ Service Worker Error:', err));
    }
  }, []);

  return (
    <div className="layout-main bg-white dark:bg-dark-950 dark:text-white">
      <div className="layout-top-container">
        <AppTopbar />
      </div>
      <div className="layout-main-container">
        <div className="relative left-0 z-50">
          <SuperAdminSidebar />
        </div>
        <div
          className={`h-auto max-w-[100vw] ${isSuperAdminSidebarVisible ? 'w-[calc(100vw-260px)]' : 'w-full'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
