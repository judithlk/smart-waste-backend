// utils/sendPushNotification.ts
import axios from "axios";

export const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string
) => {
  try {
    await axios.post("https://exp.host/--/api/v2/push/send", {
      to: expoPushToken,
      sound: "default",
      title,
      body,
    });
  } catch (err: any) {
    console.error("Failed to send push notification:", err.response?.data || err.message);
  }
};
