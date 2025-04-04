import User from "../models/user";
import messaging from "../helpers/firebaseConfig.js";

export const sendStartupNotification = async (req, res) => {
  try {
    const { id, body } = req.body;
    const user = User.findById(id);
    const registrationToken = user.notificationToken;
    const message = {
      notification: {
        title: "MindMate Notification",
        body: body,
      },
      tokens: registrationToken,
    };

    const response = await messaging.sendEachForMulticast(message);
    console.log("Startup Notification Sent:", response);
  } catch (error) {
    console.error("Error sending startup notification:", error);
  }
};
