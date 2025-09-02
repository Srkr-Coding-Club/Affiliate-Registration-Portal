// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://affiliate-registration-portal.onrender.com', 
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
});

export default axiosInstance;
