import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Update to your backend URL

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  email: string,
  username: string,
  password: string
) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    email,
    username,
    password,
  });
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
