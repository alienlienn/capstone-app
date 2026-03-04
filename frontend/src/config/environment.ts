const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL is not defined");
}

export const ENV = {
  API_BASE_URL,
  APP_BASE_URL: API_BASE_URL.replace(":8000", ":8081"),
};
