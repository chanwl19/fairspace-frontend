import axios from 'axios';
const BASE_URL = 'https://fairspace-backend-ts.vercel.app/';

axios.defaults.withCredentials = true;
export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});