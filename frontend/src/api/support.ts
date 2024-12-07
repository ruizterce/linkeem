import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sendSupport = async (content: string, contactEmail: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await axios.post(
    `${API_BASE_URL}/support/contact`,
    { content, contactEmail },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};
