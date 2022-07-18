import axios from "axios";

export const API_URL = "http://demo.magespider.com/FunctionalTest/public/api";

const apiService = axios.create({
  baseURL: API_URL,
});

export default apiService;