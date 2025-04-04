import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
 
const client = twilio(accountSid, authToken);

export const sendSMS = async (messageBody, toPhoneNumbers) => {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber, // Twilio phone number
      to: toPhoneNumbers, // Recipient number
    });

    console.log(`SMS sent! SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error.message };
  }
};

export const SOS = (async (req, res) => {
  try {
    // const { members } = req.body;
    // const phonenumbers = members.map((member) => member.phone);
  
  //!! MESSAGE Body
  const message="This is a test SMS from Twilio!";
  
    const response = await sendSMS(
      message
    );
    return res.json(response);
    
    
    
  } catch (error) {
    res.status(500).json({ status: false, message: "Something went wrong!" });
    
  }
});
