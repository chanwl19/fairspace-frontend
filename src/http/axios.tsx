import axios from 'axios';
const BASE_URL = 'https://fairspace-backend-ts.vercel.app/';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});