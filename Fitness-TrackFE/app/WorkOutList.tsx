import { Image, Pressable, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "../components/commonComponents/ThemedView";
import { ThemedText } from "../components/commonComponents/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { exercises } from "@/data/exercises";

type Exercise = {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions: string[];
  category: string;
  images: any[];
};

const WorkOutList = () => {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const selectedExercise = exercises.find((exercise) => exercise.id === exerciseId);
  if (!selectedExercise) return null;

  return (
      <ThemedView style={styles.detailsContainer}>
        <ScrollView>
          <ThemedText style={styles.exerciseTitle}>
            {selectedExercise?.name}
          </ThemedText>
          <Image
            source={selectedExercise?.images[0]}
            style={styles.mainImage}
          />
          <ThemedText style={styles.label}>
            Force:{" "}
            <ThemedText style={styles.value}>
              {selectedExercise?.force}
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.label}>
            Category:{" "}
            <ThemedText style={styles.value}>
              {selectedExercise?.category}
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.label}>
            Equipment:{" "}
            <ThemedText style={styles.value}>
              {selectedExercise?.equipment}
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.label}>
            Primary Muscles:{" "}
            <ThemedText style={styles.value}>
              {selectedExercise?.primaryMuscles.join(", ")}
            </ThemedText>
          </ThemedText>
          {selectedExercise?.secondaryMuscles &&
            selectedExercise?.secondaryMuscles?.length > 0 && (
              <ThemedText style={styles.label}>
                Secondary Muscles:{" "}
                <ThemedText style={styles.value}>
                  {selectedExercise?.secondaryMuscles?.join(", ")}
                </ThemedText>
              </ThemedText>
            )}

          <ThemedText style={styles.instructionsHeader}>
            Instructions:
          </ThemedText>
          {selectedExercise?.instructions.map((instruction, index) => (
            <ThemedText key={index} style={styles.instruction}>
              {index + 1}. {instruction}
            </ThemedText>
          ))}
        </ScrollView>
      </ThemedView>
  );
};

export default WorkOutList;

const styles = StyleSheet.create({
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  mainImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  instructionsHeader: {
    fontSize: 18,
    marginTop: 15,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  detailsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    zIndex: 10,
  },
});
