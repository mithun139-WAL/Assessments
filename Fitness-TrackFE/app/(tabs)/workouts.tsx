import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import { exercises } from "../../data/exercises";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "../../components/commonComponents/ThemedText";
import { router } from "expo-router";
import { useBookmarks } from "@/context/BookmarkContext";
import { Colors } from "@/constants/Colors";
import { useWorkout } from "../../context/WorkoutContext";

const { width } = Dimensions.get("window");

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

const WorkoutScreen = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);

  const { bookmarkedExercises, toggleBookmark } = useBookmarks();

  const [activeTab, setActiveTab] = useState<"Custom" | "Browse">("Browse");

  const { workouts, removeWorkout } = useWorkout();

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
      ) : null}

      <ThemedView style={styles.cardContent}>
        {isExercise(item) ? (
          <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
        ) : (
          <ThemedView
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ThemedText style={styles.exerciseName}>{item.name}</ThemedText>
            <Pressable onPress={() => removeWorkout(item.id)}>
              <TabBarIcon name="trash-outline" size={18} />
            </Pressable>
          </ThemedView>
        )}

        <ThemedText style={styles.category}>
          {item.category.toUpperCase()}
        </ThemedText>
        <ThemedText style={styles.level}>{item.level}</ThemedText>
      </ThemedView>
      <Pressable
        onPress={() => toggleBookmark(item.id)}
        style={{ paddingLeft: 10 }}
      >
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
        <Pressable onPress={() => setActiveTab("Custom")}>
          <ThemedText
            style={[
              styles.menuOption,
              activeTab === "Custom" && styles.activeMenuOption,
            ]}
          >
            Custom
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
      {activeTab === "Custom" && (
        <>
          {workouts?.length > 0 ? (
            <ThemedView style={{ flex: 1 }}>
              <FlatList
                data={workouts}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
              />
            </ThemedView>
          ) : (
            <ThemedView
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedView style={styles.forYouContainer}>
                <ThemedText style={styles.forYouText}>
                  This section is currently empty.
                </ThemedText>
                <ThemedText style={styles.forYouText}>
                  Click '+' to add a workout
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/customworkout")}
          >
            <TabBarIcon name="add" size={18} style={styles.addButtonText} />
          </Pressable>
        </>
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
    marginBottom: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  menuOption: {
    fontSize: 16,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 10,
    textAlign: "center",
    width: width * 0.4,
  },
  activeMenuOption: {
    fontWeight: "bold",
    borderColor: Colors.aqua,
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
    textTransform: "capitalize",
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
  addButton: {
    backgroundColor: Colors.blue,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    elevation: 5,
    margin: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "400",
  },
});

export default WorkoutScreen;
