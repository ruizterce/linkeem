import { useEffect } from "react";
import { handleGitHubLoginCallback } from "../api/auth";

const AuthCallback = () => {
  useEffect(() => {
    handleGitHubLoginCallback();
  }, []);

  return <div>Processing login...</div>;
};

export default AuthCallback;
