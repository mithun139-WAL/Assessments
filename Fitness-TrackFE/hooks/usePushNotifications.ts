import React, { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { api } from "../utils/api";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
  sendNotification: (title: string, body: string) => Promise<void>;
  scheduleDailyReminder: () => Promise<void>;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    try {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Alert.alert("Failed to get PushToken");
        }
        token = await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId,
        });
        await sendTokenToBackend(token);
        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }
        return token;
      } else {
        console.error("Please use Physical Device");
      }
    } catch (err) {
      console.error("Error registering for push notifications:", err);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: { seconds: 2 },
    });
  };

  const scheduleDailyReminder = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚀 Time to Workout!',
          body: 'Log your workout or set a new goal for today!',
          sound: true,
        },
        trigger: {
          hour: 6,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const sendTokenToBackend = async (token: Notifications.ExpoPushToken) => {
    const expoToken = token?.data;
    console.log("Expo Token",expoToken);
    try {
      const response = await api.post('/notification/register', { token: expoToken });
      console.log('Token registered successfully:', response);
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  return {
    expoPushToken,
    notification,
    sendNotification,
    scheduleDailyReminder,
  };
};
