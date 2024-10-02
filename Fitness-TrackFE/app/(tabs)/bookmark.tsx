import React from "react";
import { StyleSheet, FlatList, Image, Pressable } from "react-native";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { exercises } from "@/data/exercises";
import { useBookmarks } from "@/context/BookmarkContext";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { router } from "expo-router";

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

const BookmarkScreen = () => {
  const { bookmarkedExercises, toggleBookmark } = useBookmarks();

  const bookmarkedItems = exercises.filter((exercise) =>
    bookmarkedExercises.includes(exercise.id)
  );

  if (bookmarkedItems.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No exercises have been bookmarked yet.
        </ThemedText>
      </ThemedView>
    );
  }

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/WorkOutList",
          params: { exerciseId: item.id },
        })
      }
    >
      <Image source={item.images[0]} style={styles.thumbnail} />
      <ThemedView style={styles.cardContent}>
        <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
        <ThemedText style={styles.category}>
          {item.category.toUpperCase()}
        </ThemedText>
        <ThemedText style={styles.level}>{item.level}</ThemedText>
      </ThemedView>
      <Pressable onPress={() => toggleBookmark(item.id)}>
        <TabBarIcon
          name={bookmarkedExercises.includes(item.id) ? "bookmark" : "bookmark-outline"}
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
    backgroundColor: "#f8f8f8",
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  level: {
    fontSize: 12,
    color: "#aaa",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
