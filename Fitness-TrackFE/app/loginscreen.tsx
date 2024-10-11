import { Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const { signIn, loading, error } = useAuth();

  const validateFields = () => {
    const allFieldsFilled = email.trim() !== "" && password.trim() !== "";
    setDisabled(!allFieldsFilled);
  };

  useEffect(() => {
    validateFields();
  }, [email, password]);

  const handleLogin = async () => {
    try {
      console.log("error", error);
      await signIn(email, password);
      if (error === null) {
        router.navigate("/welcomescreen");
      }
      setEmail("");
      setPassword("");
      console.log("error after signin", error);
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <CommonTextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CommonTextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title={loading ? "Logging In..." : "Continue"}
          onPress={handleLogin}
          buttonStyle={{
            backgroundColor: disabled ? "#aeaeae" : "#28a745",
            marginTop: 20,
            paddingVertical: 16,
          }}
          textStyle={{ fontSize: 14, color: "#fff" }}
          disabled={disabled || loading}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default loginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },

  buttonContainer: {
    paddingVertical: 50,
  },
  input: {
    marginVertical: 20,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
