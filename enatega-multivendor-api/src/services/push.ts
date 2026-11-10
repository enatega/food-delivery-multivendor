import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import { GoogleAuth } from 'google-auth-library';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

const expo = new Expo({ accessToken: env.EXPO_ACCESS_TOKEN });

let fcmAuth: GoogleAuth | null = null;
let fcmProject: string | null = null;
function getFcm(): { auth: GoogleAuth; project: string } | null {
  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) return null;
  if (!fcmAuth) {
    const creds = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON) as { project_id: string };
    fcmProject = creds.project_id;
    fcmAuth = new GoogleAuth({ credentials: creds, scopes: ['https://www.googleapis.com/auth/firebase.messaging'] });
  }
  return { auth: fcmAuth, project: fcmProject! };
}

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default' | null;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

/** Sends a push notification to Expo push tokens and/or FCM (web) tokens. Never throws. */
export async function sendPush(tokens: (string | null | undefined)[], payload: PushPayload): Promise<void> {
  const unique = [...new Set(tokens.filter((t): t is string => Boolean(t)))];
  if (unique.length === 0) return;
  const expoTokens = unique.filter((t) => Expo.isExpoPushToken(t));
  const fcmTokens = unique.filter((t) => !Expo.isExpoPushToken(t));

  if (expoTokens.length) {
    const messages: ExpoPushMessage[] = expoTokens.map((to) => ({
      to,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      sound: payload.sound === null ? undefined : 'default',
      channelId: payload.channelId,
      priority: payload.priority ?? 'high',
    }));
    for (const chunk of expo.chunkPushNotifications(messages)) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        const errors = tickets.filter((t) => t.status === 'error');
        if (errors.length) logger.warn({ errors: errors.slice(0, 5) }, 'Some Expo push notifications failed');
      } catch (err) {
        logger.error({ err }, 'Expo push failed');
      }
    }
  }

  const fcm = getFcm();
  if (fcmTokens.length && fcm) {
    try {
      const client = await fcm.auth.getClient();
      const { token } = await client.getAccessToken();
      await Promise.allSettled(
        fcmTokens.map((t) =>
          fetch(`https://fcm.googleapis.com/v1/projects/${fcm.project}/messages:send`, {
            method: 'POST',
            headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
            body: JSON.stringify({
              message: {
                token: t,
                notification: { title: payload.title, body: payload.body },
                data: Object.fromEntries(Object.entries(payload.data ?? {}).map(([k, v]) => [k, String(v)])),
              },
            }),
            signal: AbortSignal.timeout(10_000),
          }),
        ),
      );
    } catch (err) {
      logger.error({ err }, 'FCM push failed');
    }
  }
}
