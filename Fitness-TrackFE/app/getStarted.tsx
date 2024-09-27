import { Pressable, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { CommonButton } from "@/components/CommonButton";
import CommonTextInput from "@/components/CommonTextInput";
import { router } from "expo-router";

const getStarted = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  const validateFields = () => {
    const allFieldsFilled =
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "";
    setDisabled(!allFieldsFilled);
  };

  useEffect(() => {
    validateFields();
  }, [name, email, password, confirmPassword]);
  const handleCreateAccount = () => {
    console.log("Create Account Pressed", {
      name,
      email,
      password,
      confirmPassword,
    });
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    }
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    router.push('/(tabs)')
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.textContainer}>
        <CommonTextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <CommonTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CommonTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CommonTextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </ThemedView>
      <ThemedView style={{paddingHorizontal: 14}}>
        <CommonButton
          title="Create Account"
          onPress={handleCreateAccount}
          buttonStyle={{
            backgroundColor: disabled ? "#aeaeae" : "#28a745",
            marginTop: 20,
            paddingVertical: 16,
          }}
          textStyle={{ fontSize: 14 }}
          disabled={disabled}
        />
         <Pressable
          onPress={() => router.push('/loginScreen')}
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

export default getStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: 20,
  },
  textContainer: {
    paddingHorizontal: 12,
  },
  text: {
    marginVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
