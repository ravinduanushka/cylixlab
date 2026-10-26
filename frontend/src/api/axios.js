import axios from 'axios';

// Backend production URL: https://cylixlab.vercel.app
export const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://cylixlab.vercel.app' : '');

// Configure global Axios defaults so existing components calling axios.get/post automatically connect
if (BACKEND_URL) {
  axios.defaults.baseURL = BACKEND_URL;
}
axios.defaults.withCredentials = true;

// Configured Axios instance
export const API = axios.create({
  baseURL: BACKEND_URL || undefined,
  withCredentials: true,
});

export default API;
