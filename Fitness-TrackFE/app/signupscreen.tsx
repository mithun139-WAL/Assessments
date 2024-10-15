import { StyleSheet, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const SignUpScreen = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { signUp, loading, error } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUp = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const success = await signUp(userName, email, password);
      if (success) {
        router.push("/loginscreen");
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Signup failed", error || "Please try again later.");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      Alert.alert("Signup failed", "Please try again later.");
    }
  };
  return (
    <ThemedView style={[styles.container, { paddingTop: 50 }]}>
      <ThemedView style={styles.formContainer}>
        <CommonTextInput
          style={styles.input}
          placeholder="Enter UserName"
          value={userName}
          onChangeText={setUserName}
        />
        <CommonTextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        <CommonTextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CommonTextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title={loading ? "Signing Up..." : "Get Started"}
          onPress={handleSignUp}
          buttonStyle={styles.buttonStyle}
          textStyle={{ fontSize: 18 }}
          disabled={loading}
        />
        <Pressable
          onPress={() => router.navigate("/loginscreen")}
          style={{ alignItems: "center" }}
        >
          <ThemedText style={styles.text}>
            Already have an account? Login
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  title: {
    fontSize: 30,
    textTransform: "uppercase",
    letterSpacing: 10,
    paddingVertical: 40,
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 50,
  },
  text: {
    marginVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    marginBottom: 15,
    width: "90%",
  },
  buttonStyle: { backgroundColor: Colors.blue, marginVertical: 20 },
});
