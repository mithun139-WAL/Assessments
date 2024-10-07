import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { exercises } from "../../data/exercises";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "../../components/commonComponents/ThemedText";
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

  const [activeTab, setActiveTab] = useState<"ForYou" | "Browse">("Browse");

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
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
      <ThemedView style={styles.menuBar}>
        <Pressable onPress={() => setActiveTab("ForYou")}>
          <ThemedText
            style={[
              styles.menuOption,
              activeTab === "ForYou" && styles.activeMenuOption,
            ]}
          >
            For You
          </ThemedText>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Browse")}>
          <ThemedText
            style={[
              styles.menuOption,
              activeTab === "Browse" && styles.activeMenuOption,
            ]}
          >
            Browse
          </ThemedText>
        </Pressable>
      </ThemedView>
      {activeTab === "Browse" && (
        <>
          <ThemedView style={styles.searchContainer}>
            <TabBarIcon
              name="search"
              size={18}
              color="#ddd"
              style={{ paddingEnd: 10 }}
            />
            <TextInput
              style={styles.searchBar}
              placeholder="Search exercises by name, level, equipment, etc."
              value={searchText}
              onChangeText={handleSearch}
              placeholderTextColor="#ddd"
            />
          </ThemedView>
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
      {activeTab === "ForYou" && (
        <ThemedView style={styles.forYouContainer}>
          <ThemedText style={styles.forYouText}>
            This section is currently empty.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  menuOption: {
    fontSize: 16,
    color: "#666",
  },
  activeMenuOption: {
    color: "#000",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 35,
    marginTop: 20,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: "row",
    padding: 15,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 15,
  },
  exerciseName: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1,
  },
  category: {
    fontSize: 10,
    color: "#666",
  },
  level: {
    fontSize: 12,
    color: "#aaa",
    textTransform: 'capitalize',
  },
  thumbnail: {
    width: 100,
    height: 90,
    borderRadius: 5, 
  },
  forYouContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  forYouText: {
    fontSize: 16,
    color: "#888",
  },
});

export default WorkoutScreen;
