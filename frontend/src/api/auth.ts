import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export const loginGitHub = async () => {
  window.location.href = `${API_BASE_URL}/auth/github`;
};

export const handleGitHubLoginCallback = () => {
  console.log("handling github callback");
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  console.log(token);

  if (token) {
    localStorage.setItem("token", token);
    console.log("Token saved:", token);
    window.location.href = "/feed";
  } else {
    console.error("GitHub login failed: No token received");
  }
};
