import React from "react";
import { StyleSheet, FlatList, Image, Pressable } from "react-native";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { exercises } from "@/data/exercises";
import { useBookmarks } from "@/context/BookmarkContext";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { router } from "expo-router";
import { useWorkout } from "@/context/WorkoutContext";

type Exercise = {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: any[];
};

type Workout = {
  id: string;
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions: string[];
  category: string;
};

const BookmarkScreen = () => {
  const { bookmarkedExercises, toggleBookmark } = useBookmarks();
  const { workouts } = useWorkout();

  const bookmarkedItems = [
    ...exercises.filter((exercise) => bookmarkedExercises.includes(exercise.id)),
    ...workouts.filter((workout) => bookmarkedExercises.includes(workout.id)),
  ];
  if (bookmarkedItems.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No exercises have been bookmarked yet.
        </ThemedText>
      </ThemedView>
    );
  }

  const isExercise = (item: any): item is Exercise => {
    return item.images && Array.isArray(item.images);
  };

  const renderExerciseItem = ({ item }: { item: Exercise | Workout }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/WorkOutList",
          params: { exerciseId: item.id },
        })
      }
    >
      {isExercise(item) ? (
        <Image source={item.images[0]} style={styles.thumbnail} />
      ):
      <Image
              source={require("../../assets/images/logo-black.png")}
              style={styles.thumbnail}
            />}
      <ThemedView style={styles.cardContent}>
        <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
        <ThemedText style={styles.category}>
          {item.category.toUpperCase()}
        </ThemedText>
        <ThemedText style={styles.level}>{item.level}</ThemedText>
      </ThemedView>
      <Pressable onPress={() => toggleBookmark(item.id)}>
        <TabBarIcon
          name={
            bookmarkedExercises.includes(item.id)
              ? "bookmark"
              : "bookmark-outline"
          }
          size={18}
        />
      </Pressable>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={bookmarkedItems}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 15,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  category: {
    fontSize: 10,
    color: "#666",
  },
  level: {
    fontSize: 12,
    color: "#aaa",
    textTransform: "capitalize",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});
