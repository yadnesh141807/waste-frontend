import axios from "axios";

const API = axios.create({
  baseURL:"https://waste-backend-1-b1lj.onrender.com",
});

export default API;
