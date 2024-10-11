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
import { router } from "expo-router";

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  editUserName: (newName: string) => Promise<void>;
  checkUser:() => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOutUser: async () => {},
  editUserName: async () => {},
  checkUser: async () => {},
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
      console.log("Async Storage Data",userData);
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
    } catch (err) {
      setError("Error during login: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log("Data",  name, email, password);
    
    try {
      const response = await api.post("/user/signup", {
        name,
        email,
        password,
      });
      const userData = response;
      setUserInfo(userData);
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
    } catch (err) {
      console.error("Error during signup:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "An error occurred");

      setError("Error during signup: " + message);
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
    } catch (err) {
      setError("Error signing out: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const editUserName = async (newName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch("/user/edit", { name: newName });
      const updatedUserData: User = response;
      setUserInfo(updatedUserData);
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUserData));
    } catch (err) {
      setError("Error updating username: " + (err as Error).message);
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
      editUserName,
      checkUser,
    }),
    [userInfo, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
