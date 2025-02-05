import axios from "axios";

const api = axios.create({
  baseURL: 'https://www.runourished.co/' //process.env.REACT_APP_BACKEND_URL,  Dynamically use the correct backend URL
});

export default api;