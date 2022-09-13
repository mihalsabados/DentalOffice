import axios from 'axios';
import { getCurrentUser, getToken } from './authService';


const api = axios.create({
    baseURL: 'http://localhost:8081/dentalOffice/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
});

api.interceptors.request.use(request => {
  const isLoggedIn = getCurrentUser() !== null;
  if (isLoggedIn) {
      request.headers.common.Authorization = `Bearer ${getToken()}`;
  }
  return request;
});

export default api;