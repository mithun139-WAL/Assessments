import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "../components/commonComponents/ThemedText";
import { router } from "expo-router";
import { TabBarIcon } from "../components/commonComponents/TabBarIcon";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "../constants/Colors";

const profile = () => {
  const { userInfo } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.profileContainer}>
        <ThemedView style={styles.personIcon}>
          <TabBarIcon name="person" size={60} />
        </ThemedView>

        <ThemedView>
          <ThemedText style={styles.name}>
            {userInfo?.name || "Guest"}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.emailContainer}>
        <ThemedText>Email</ThemedText>
        <ThemedText style={styles.email}>{userInfo?.email}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoContainer}>
        <Pressable onPress={() => router.navigate("/settings")}>
          <ThemedText>Settings</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
  },
  profileContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 50,
  },
  personIcon: { backgroundColor: Colors.grey, padding: 15, borderRadius: 50 },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    paddingVertical: 20,
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  email: {
    fontSize: 18,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: Colors.grey,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
