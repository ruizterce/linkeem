import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  return { Authorization: `Bearer ${token}` };
};

export const fetchUserById = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  console.log(response.data);
  return response.data;
};

export const fetchUserByIdExtended = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/extended`, {
    headers: getAuthHeaders(),
  });
  console.log(response.data);
  return response.data;
};

export const followUser = async (userId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/${userId}/follow`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  console.log(response.data);
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}/follow`,
    {
      headers: getAuthHeaders(),
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
  const response = await axios.get(`${API_BASE_URL}/users`, {
    params: { query, page, limit },
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await axios.post(
    `${API_BASE_URL}/users/${userId}/profile-picture`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("Upload successful:", response.data);
  return response.data.profilePicturePath;
};
