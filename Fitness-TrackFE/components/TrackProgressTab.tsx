// import React from "react";
// import { FlatList, StyleSheet } from "react-native";
// import { ThemedView } from "@/components/commonComponents/ThemedView";
// import { ThemedText } from "@/components/commonComponents/ThemedText";

// type ProgressData = { date: string; totalWeight: number; totalReps: number };

// const TrackProgressTab = ({
//   progressData,
// }: {
//   progressData: ProgressData[];
// }) => (
//   <FlatList
//     data={progressData}
//     keyExtractor={(item, index) => index.toString()}
//     renderItem={({ item }) => (
//       <ThemedView style={styles.progressItem}>
//         <ThemedText>Date: {item.date}</ThemedText>
//         <ThemedText>Total Weight: {item.totalWeight} lbs</ThemedText>
//         <ThemedText>Total Reps: {item.totalReps}</ThemedText>
//       </ThemedView>
//     )}
//   />
// );

// const styles = StyleSheet.create({
//   progressItem: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: "#d1f7c4",
//     borderRadius: 5,
//   },
// });

// export default TrackProgressTab;

import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { useWorkout } from "@/context/WorkoutContext";

const TrackProgressTab: React.FC = () => {
  const { progressData } = useWorkout();
  console.log(progressData);
  

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Workout Progress</ThemedText>
      <FlatList
        data={progressData}
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
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  progressItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
