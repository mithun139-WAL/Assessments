import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useWorkout } from "@/context/WorkoutContext";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { Picker } from "@react-native-picker/picker";
import { TabBarIcon } from "./commonComponents/TabBarIcon";

const muscleGroups = {
  Abs: "Abs",
  Back: "Back",
  Biceps: "Biceps",
  Cardio: "Cardio",
  Chest: "Chest",
  Legs: "Legs",
  Shoulders: "Shoulders",
  Triceps: "Triceps",
};

const SetGoalsTab = () => {
  const { goals, setGoal, removeGoal } = useWorkout();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>();
  const [targetWeight, setTargetWeight] = useState<number>(0);

  const handleAddGoal = () => {
    if (selectedMuscle && targetWeight > 0) {
      const newGoal = {
        name: selectedMuscle,
        target: targetWeight,
        progress: 0,
      };
      setGoal(newGoal);
      setModalVisible(false);
      setSelectedMuscle(undefined);
      setTargetWeight(0);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Your Fitness Goals</ThemedText>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.goalItem}>
            <ThemedView
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText style={styles.goalName}>{item.name}</ThemedText>
              <Pressable onPress={() => removeGoal(item.id)}>
                <ThemedText style={styles.removeGoal}>
                  <TabBarIcon name="trash" size={18} />
                </ThemedText>
              </Pressable>
            </ThemedView>
            <ThemedText style={styles.goalProgress}>
              Target: {item.target} lbs | Progress: {item.progress}%
            </ThemedText>
          </ThemedView>
        )}
      />

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText style={styles.addButtonText}>
          <TabBarIcon name="add" />
        </ThemedText>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>Set New Goal</ThemedText>

          <Picker
            selectedValue={selectedMuscle}
            onValueChange={(itemValue) => setSelectedMuscle(itemValue)}
          >
            <Picker.Item label="Select Muscle Group" value={undefined} />
            {Object.keys(muscleGroups).map((muscle) => (
              <Picker.Item label={muscle} value={muscle} key={muscle} />
            ))}
          </Picker>

          <TextInput
            placeholder="Target Weight (lbs)"
            value={targetWeight.toString()}
            onChangeText={(text) => setTargetWeight(Number(text))}
            keyboardType="numeric"
            style={styles.input}
          />

          <Pressable style={styles.saveButton} onPress={handleAddGoal}>
            <ThemedText style={styles.saveButtonText}>Add Goal</ThemedText>
          </Pressable>
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <TabBarIcon name="close-circle-outline" style={{ color: "#000" }} />
          </Pressable>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 10,
  },
  goalItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  goalName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  goalProgress: {
    color: "#555",
  },
  removeGoal: {
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  closeButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
export default SetGoalsTab;
