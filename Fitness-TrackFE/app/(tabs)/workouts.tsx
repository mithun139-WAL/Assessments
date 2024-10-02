import React, { useState } from "react";
import { StyleSheet, FlatList, Image, Pressable } from "react-native";
import { exercises } from "../../data/exercises";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "../../components/commonComponents/ThemedText";
import CommonTextInput from "@/components/commonComponents/CommonTextInput";
import { router } from "expo-router";
import { useBookmarks } from "@/context/BookmarkContext";

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

const WorkoutScreen = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  
    const { bookmarkedExercises, toggleBookmark } = useBookmarks();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 3) {
      const filteredData = exercises.filter((exercise) => {
        const lowerCaseText = text.toLowerCase();
        return (
          exercise.name.toLowerCase().includes(lowerCaseText) ||
          exercise.level.toLowerCase().includes(lowerCaseText) ||
          exercise.force?.toLowerCase().includes(lowerCaseText) ||
          exercise.equipment?.toLowerCase().includes(lowerCaseText) ||
          exercise.primaryMuscles.some((muscle) =>
            muscle.toLowerCase().includes(lowerCaseText)
          )
        );
      });
      setFilteredExercises(filteredData);
    } else {
      setFilteredExercises(exercises);
    }
  };

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
        <TabBarIcon name={bookmarkedExercises.includes(item.id) ? "bookmark" : "bookmark-outline"} size={18} />
      </Pressable>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <CommonTextInput
        style={styles.searchBar}
        placeholder="Search exercises by name, level, equipment, etc."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f8f8f8",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    marginHorizontal: 15,
    borderRadius: 5,
    marginBottom: 35,
    elevation: 1,
    backgroundColor: "#fff",
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

export default WorkoutScreen;
