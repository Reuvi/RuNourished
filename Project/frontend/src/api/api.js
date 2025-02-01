import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5002' //process.env.REACT_APP_BACKEND_URL,  Dynamically use the correct backend URL
});

export default api;