import axios from "axios";

export const sendWhatsAppMessage = async (to, message, isFirstMessage = false) => {
  try {
    let payload;

    if (isFirstMessage) {
      // Template message (required first time)
      payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      };
    } else {
      // Normal text message
      payload = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      };
    }

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp sent ✅", response.data);
  } catch (err) {
    console.error("WhatsApp error:", err.response?.data || err.message);
  }
};