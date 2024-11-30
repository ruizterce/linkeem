import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchFollowedPosts = async (page: number, limit: number) => {
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

export const fetchPosts = async (page: number, limit: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log(token);
  const response = await axios.get(`${API_BASE_URL}/posts/discover`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export const fetchPostById = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export const postPost = async (content: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.post(
    `${API_BASE_URL}/posts`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};

export const likePost = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/like`,
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

export const unlikePost = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.delete(`${API_BASE_URL}/posts/${postId}/like`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

export const postComment = async (content: string, postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.post(
    `${API_BASE_URL}/comments`,
    { postId, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};
