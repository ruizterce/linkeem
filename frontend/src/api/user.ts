import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUserById = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export const fetchUserByIdExtended = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.get(`${API_BASE_URL}/users/${userId}/extended`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export const followUser = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const response = await axios.post(
    `${API_BASE_URL}/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}/follow`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};

export const fetchUsers = async (
  query: string,
  page: number,
  limit: number
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const response = await axios.get(`${API_BASE_URL}/users`, {
    params: { query, page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
