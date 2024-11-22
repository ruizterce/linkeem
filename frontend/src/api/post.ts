import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchPosts = async (page: number, limit: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log(token);
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};
