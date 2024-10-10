import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { router } from "expo-router";

const loginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  const validateFields = () => {
    const allFieldsFilled = email.trim() !== "" && password.trim() !== "";
    setDisabled(!allFieldsFilled);
  };

  useEffect(() => {
    validateFields();
  }, [email, password]);
  const handleLogin = () => {
    console.log("Logged In", {
      email,
      password,
    });
    setEmail("");
    setPassword("");
    router.push('/(tabs)')
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title="Login with Google"
          onPress={() => console.log("Button Pressed")}
          iconName="logo-google"
          iconPosition="left"
          iconColor="#28a745"
          iconSize={28}
          buttonStyle={{
            marginVertical: 20,
            borderWidth: 1,
            borderColor: "#28a745",
            backgroundColor: 'none'
          }}
          textStyle={{ fontSize: 14 }}
          iconStyle={{ marginRight: 10 }}
          disabled={false}
        />
        <ThemedText style={{ color: "#ddd", textAlign: "center" }}>
          Or login with your email
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.formContainer}>
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
        <CommonButton
          title="Continue"
          onPress={handleLogin}
          buttonStyle={{
            backgroundColor: disabled ? "#aeaeae" : "#28a745",
            marginTop: 20,
            paddingVertical: 16,
          }}
          textStyle={{ fontSize: 14, color: '#fff' }}
          disabled={disabled}
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
    marginTop: 22,
  },
  formContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
});
