import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Modal,
  Button,
} from "react-native";
import { useWorkout } from "@/context/WorkoutContext";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { Picker } from "@react-native-picker/picker";

type ExerciseLog = {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

const LogWorkoutTab = () => {
  const { exerciseLogs, addWorkoutLog, updateProgress } = useWorkout();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<
    keyof typeof muscleGroups | undefined
  >();
  const [selectedExercise, setSelectedExercise] = useState<
    string | undefined
  >();
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);

  const muscleGroups = {
    Abs: ["3/4 Sit-Up", "Floor Crunch"],
    Back: ["Deadlift", "Lat Pulldown"],
    Biceps: ["Bicep Curl", "Hammer Curls"],
    Cardio: ["Running", "Cycling"],
    Chest: ["Benchpress", "Dumbbell Press"],
    Legs: ["Squats", "Lunges"],
    Shoulders: ["Shoulder Press", "Dumbbell Press"],
    Triceps: ["Tricep Pulldown", "Overhead Tricep Extension"],
  };

  const handleAddWorkout = () => {
    if (selectedExercise) {
      const newLog: ExerciseLog = {
        exercise: selectedExercise,
        sets: 1,
        reps: reps,
        weight: weight,
        date: new Date().toLocaleDateString(),
      };
      updateProgress({
        date: newLog.date,
        totalWeight: newLog.weight * newLog.reps,
        totalReps: newLog.reps,
      });
      addWorkoutLog(newLog);
      setModalVisible(false);
      setSelectedMuscle(undefined);
      setSelectedExercise(undefined);
      setWeight(0);
      setReps(0);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Workout Logs</ThemedText>

      <FlatList
        data={exerciseLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <ThemedText style={styles.exerciseName}>{item.exercise}</ThemedText>
            <ThemedText style={styles.logDetails}>
              Sets: {item.sets}, Reps: {item.reps}, Weight: {item.weight} lbs
            </ThemedText>
            <ThemedText style={styles.logDate}>Date: {item.date}</ThemedText>
          </View>
        )}
      />

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText style={styles.addButtonText}>+</ThemedText>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <ThemedText style={styles.saveButtonText}>X</ThemedText>
          </Pressable>
          <ThemedText style={styles.modalTitle}>Log New Workout</ThemedText>

          <Picker
            selectedValue={selectedMuscle}
            onValueChange={(itemValue) => {
              setSelectedMuscle(itemValue);
              setSelectedExercise(undefined);
            }}
          >
            <Picker.Item label="Select Muscle Group" value={undefined} />
            {Object.keys(muscleGroups).map((muscle) => (
              <Picker.Item label={muscle} value={muscle} key={muscle} />
            ))}
          </Picker>

          {selectedMuscle && (
            <Picker
              selectedValue={selectedExercise}
              onValueChange={(itemValue) => setSelectedExercise(itemValue)}
            >
              <Picker.Item label="Select Exercise" value={undefined} />
              {selectedMuscle &&
                muscleGroups[selectedMuscle].map((exercise) => (
                  <Picker.Item
                    label={exercise}
                    value={exercise}
                    key={exercise}
                  />
                ))}
            </Picker>
          )}

          {selectedExercise && (
            <>
              <View style={styles.counterContainer}>
                <ThemedText>Weight (lbs): </ThemedText>
                <Button
                  title="-"
                  onPress={() => setWeight((prev) => Math.max(0, prev - 1))}
                />
                <ThemedText style={styles.counterValue}>{weight}</ThemedText>
                <Button
                  title="+"
                  onPress={() => setWeight((prev) => prev + 1)}
                />
              </View>

              <View style={styles.counterContainer}>
                <ThemedText>Reps: </ThemedText>
                <Button
                  title="-"
                  onPress={() => setReps((prev) => Math.max(0, prev - 1))}
                />
                <ThemedText style={styles.counterValue}>{reps}</ThemedText>
                <Button title="+" onPress={() => setReps((prev) => prev + 1)} />
              </View>

              <Pressable style={styles.saveButton} onPress={handleAddWorkout}>
                <ThemedText style={styles.saveButtonText}>Add</ThemedText>
              </Pressable>
            </>
          )}
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

export default LogWorkoutTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  logDetails: {
    color: "#555",
  },
  logDate: {
    color: "#777",
    fontSize: 12,
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
    elevation: 5,
    paddingTop: 7,
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
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  counterValue: {
    marginHorizontal: 15,
    fontSize: 18,
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
  closeButton: {
    backgroundColor: "#dc3545",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
    elevation: 5,
  },
});
