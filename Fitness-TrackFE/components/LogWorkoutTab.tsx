import React, { useState } from "react";
import { StyleSheet, FlatList, Pressable, Modal, Button } from "react-native";
import { useWorkout } from "@/context/WorkoutContext";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { Picker } from "@react-native-picker/picker";
import { muscleGroups, muscleExercises } from "../data/targetmucles";
import { TabBarIcon } from "./commonComponents/TabBarIcon";
import { Colors } from "@/constants/Colors";

type ExerciseLog = {
  exercise: string;
  muscle: string | undefined;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

const LogWorkoutTab = () => {
  const { exerciseLogs, addWorkoutLog, updateProgress, removeWorkoutLog } =
    useWorkout();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<
    keyof typeof muscleExercises | undefined
  >();
  const [selectedExercise, setSelectedExercise] = useState<
    string | undefined
  >();
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);

  const handleAddWorkout = () => {
    if (selectedExercise) {
      const newLog: ExerciseLog = {
        exercise: selectedExercise,
        muscle: selectedMuscle,
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
      <ThemedText style={styles.header}> Log Your Workouts</ThemedText>

      <ThemedView style={{ paddingVertical: 30 }}>
        <FlatList
          data={exerciseLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.logItem}>
              <ThemedView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText style={styles.exerciseName}>
                  {item.exercise} - {item.muscle}
                </ThemedText>
                <Pressable onPress={() => removeWorkoutLog(item.id)}>
                  <TabBarIcon name="trash" size={16} />
                </Pressable>
              </ThemedView>

              <ThemedText style={styles.logDetails}>
                Sets: {item.sets}, Reps: {item.reps}, Weight: {item.weight} lbs
              </ThemedText>
              <ThemedText style={styles.logDate}>Date: {item.date}</ThemedText>
            </ThemedView>
          )}
        />
      </ThemedView>

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <ThemedText style={styles.addButtonText}>Log</ThemedText>
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
            <TabBarIcon name="close-circle-outline" style={{ color: "#000" }} />
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
            {muscleGroups.map((muscle) => (
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
                muscleExercises[selectedMuscle].map((exercise) => (
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
              <ThemedView style={styles.counterContainer}>
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
              </ThemedView>

              <ThemedView style={styles.counterContainer}>
                <ThemedText>Reps: </ThemedText>
                <Button
                  title="-"
                  onPress={() => setReps((prev) => Math.max(0, prev - 1))}
                />
                <ThemedText style={styles.counterValue}>{reps}</ThemedText>
                <Button title="+" onPress={() => setReps((prev) => prev + 1)} />
              </ThemedView>

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
    fontWeight: "400",
    marginBottom: 10,
  },
  logItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  logDetails: {},
  logDate: {
    color: "#777",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: Colors.blue,
    width: 90,
    height: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
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
    color: "#dc3545",
    textAlign: "center",
    fontWeight: "300",
    fontSize: 14,
  },
  closeButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 10,
  },
});
