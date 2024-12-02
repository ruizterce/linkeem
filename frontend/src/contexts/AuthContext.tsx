import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { verifyToken } from "../api/auth";

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  date: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  triggerRefresh: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
  triggerRefresh: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await verifyToken(token);
        setIsAuthenticated(true);
        setUser({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          profilePicture: response.user.profilePicture,
          date: response.user.date,
        });
      } catch (error) {
        console.error("Token verification failed", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Trigger user data refresh
  const triggerRefresh = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Fetch user data on initial render
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, isLoading, triggerRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};
