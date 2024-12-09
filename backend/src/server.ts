import dotenv from "dotenv";
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

import app from "./App";

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

app.listen(PORT, () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Loaded ENV API_URL:", process.env.API_URL);
  console.log(`Server is running on ${API_URL} PORT ${PORT}`);
});
