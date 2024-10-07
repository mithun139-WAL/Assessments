import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import SetGoalsTab from "@/components/SetGoalsTab";
import LogWorkoutTab from "../../components/LogWorkoutTab";
import TrackProgressTab from "@/components/TrackProgressTab";

type ExerciseLog = {
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type ProgressData = {
  date: string;
  totalWeight: number;
  totalReps: number;
};

type Goal = {
  id: string;
  name: string;
  target: string;
  progress: number;
};

export default function WorkoutLoggingScreen() {
  const [activeTab, setActiveTab] = useState<string>("Log Workout");
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const logs = await AsyncStorage.getItem("exerciseLogs");
      const progress = await AsyncStorage.getItem("progressData");
      const savedGoals = await AsyncStorage.getItem("goals");

      if (logs) setExerciseLogs(JSON.parse(logs));
      if (progress) setProgressData(JSON.parse(progress));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };

    fetchData();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Log Workout":
        return <LogWorkoutTab />;
      case "Track Progress":
        return <TrackProgressTab />;
      case "Set Goals":
        return <SetGoalsTab />;
      default:
        return <LogWorkoutTab />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.tabContainer}>
        {["Log Workout", "Track Progress", "Set Goals"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <ThemedText style={styles.tabText}>{tab}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>
      {renderActiveTab()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: { padding: 10, borderBottomWidth: 2, borderColor: "transparent" },
  activeTab: { borderColor: "blue" },
  tabText: { fontSize: 16, fontWeight: "500" },
});
