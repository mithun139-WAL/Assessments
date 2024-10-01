import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  User,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextProps {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userInfo: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "295526462555-b6pkdu5tejsllnm8p3174391l29m8hsm.apps.googleusercontent.com",
    iosClientId:
      "295526462555-f8rnaoejh07hl445u604tcpotnu9rk1m.apps.googleusercontent.com",
    webClientId:
      "295526462555-khfkq4ds64hkiofgn8hanocmos7g8ask.apps.googleusercontent.com",
    clientId:
      "295526462555-khfkq4ds64hkiofgn8hanocmos7g8ask.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credentials = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credentials);
    }
  }, [response]);

  const checkUser = async () => {
    try {
      const userJSON = await ReactNativeAsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    checkUser();
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User", JSON.stringify(user));
        setUserInfo(user);
        await ReactNativeAsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log("User not Authenticated");
      }
    });
    return () => unSubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    console.log("entered");
    setLoading(true);
    setError(null);
    try {
      await promptAsync();
    } catch (err) {
      setError("Error during Google Sign-In: " + err);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await ReactNativeAsyncStorage.removeItem("@user");
      setUserInfo(null);
    } catch (err) {
      setError("Error signing out: " + err);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      userInfo,
      loading,
      error,
      signInWithGoogle,
      signOutUser,
    }),
    [userInfo, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
