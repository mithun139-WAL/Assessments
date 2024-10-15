import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextProps {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOutUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
  error: null,
  signIn: async () => false,
  signUp: async () => false,
  signOutUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/user/login", { email, password });
      
      const userData: User = response;
      setUserInfo(userData);
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      return true;
    } catch (err) {
      setError("Error during login: " + (err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);    
    try {
      const response = await api.post("/user/signup", {
        name,
        email,
        password,
      });
      const userData = response;
      setUserInfo(userData);
      return true;
    } catch (err) {
      console.error("Error during signup:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "An error occurred");

      setError("Error during signup: " + message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem("@user");
      setUserInfo(null);
      return true;
    } catch (err) {
      setError("Error signing out: " + (err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      userInfo,
      loading,
      error,
      signIn,
      signUp,
      signOutUser,
    }),
    [userInfo, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
