import { StyleSheet, Pressable, Modal, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import { useAuth } from "@/context/AuthContext";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { router } from 'expo-router';

const Settings: React.FC = () => {
  const { signOutUser } = useAuth();
  const [height, setHeight] = useState<string>("edit");
  const [weight, setWeight] = useState<string>("edit");
  const [heightModalVisible, setHeightModalVisible] = useState<boolean>(false);
  const [weightModalVisible, setWeightModalVisible] = useState<boolean>(false);

  const handleSignOut = async () => {
    await signOutUser();
    router.replace("/");
  };


  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
    setHeightModalVisible(false);
  };

  const handleWeightChange = (newWeight: string) => {
    setWeight(newWeight);
    setWeightModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.heightContainer}>
        <ThemedText style={styles.value}>Height </ThemedText>
        <Pressable onPress={() => setHeightModalVisible(true)}>
          <ThemedText>{height}</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.heightContainer}>
        <ThemedText style={styles.value}>Weight </ThemedText>
        <Pressable onPress={() => setWeightModalVisible(true)}>
          <ThemedText> {weight}</ThemedText>
        </Pressable>
      </ThemedView>

      <Pressable onPress={handleSignOut} style={styles.button}>
        <TabBarIcon name="log-out-outline" size={20} />
        <ThemedText style={styles.text}> LogOut</ThemedText>
      </Pressable>

      <Modal visible={heightModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Select Height</ThemedText>
          {[...Array(240)].map((_, index) => {
            const value = 61 + index;
            return (
              <Pressable
                key={value}
                onPress={() => handleHeightChange(`${value}cm`)}
              >
                <ThemedText style={styles.modalItem}>{value}cm</ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
        <CommonButton
          title="Close"
          onPress={() => setHeightModalVisible(false)}
        />
      </Modal>

      <Modal visible={weightModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Select Weight</ThemedText>
          {[...Array(215)].map((_, index) => {
            const value = 13 + index;
            return (
              <Pressable
                key={value}
                onPress={() => handleWeightChange(`${value}kg`)}
              >
                <ThemedText style={styles.modalItem}>{value}kg</ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
        <CommonButton
          title="Close"
          onPress={() => setWeightModalVisible(false)}
        />
      </Modal>
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  value: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
  },
  text: {
    paddingHorizontal: 5,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: "center",
  },
});
