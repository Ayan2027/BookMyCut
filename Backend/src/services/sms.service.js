import axios from "axios";

export const sendSMS = async (numbers, message) => {
  try {
    const phoneNumbers = Array.isArray(numbers)
      ? numbers.join(",")
      : numbers;

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q", // promotional
        message: message,
        language: "english",
        flash: 0,
        numbers: phoneNumbers,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SMS sent ✅", response.data);
  } catch (error) {
    console.error("SMS failed ❌", error.response?.data || error.message);
  }
};