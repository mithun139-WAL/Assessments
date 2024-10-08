import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { useWorkout } from "@/context/WorkoutContext";

const TrackProgressTab: React.FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const { progressData } = useWorkout();  
  
  const formatDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
  const filteredProgress = progressData.filter(
    (progress) => progress.date === formatDate(selectedDate)
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Workout Progress</ThemedText>
      <FlatList
        data={filteredProgress}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.progressItem}>
            <ThemedText style={styles.dateText}>Date: {item.date}</ThemedText>
            <ThemedText>Total Weight Lifted: {item.totalWeight} lbs</ThemedText>
            <ThemedText>Total Reps: {item.totalReps}</ThemedText>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </ThemedView>
  );
};

export default TrackProgressTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  progressItem: {
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
