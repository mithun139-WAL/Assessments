import React, { memo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import { exercises } from "../../data/exercises";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "../../components/commonComponents/ThemedText";
import { router } from "expo-router";
import { useBookmarks } from "@/context/BookmarkContext";
import { Colors } from "@/constants/Colors";
import { useWorkout } from "../../context/WorkoutContext";
import { debounce } from "lodash";
import { Exercise, Workout } from "@/exercise";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const { width } = Dimensions.get("window");

const WorkoutScreen = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredExercises, setFilteredExercises] =
    useState<Exercise[]>(exercises);
  const [activeTab, setActiveTab] = useState<"Custom" | "Browse">("Browse");

  const { bookmarkedExercises, toggleBookmark } = useBookmarks();
  const { workouts, removeWorkout } = useWorkout();
  const { sendNotification, expoPushToken, notification } = usePushNotifications();

  const handleSearch = useCallback(
    debounce((text: string) => {
      if (text.length > 2) {
        const filteredData = exercises.filter(
          (exercise) =>
            [
              exercise.name,
              exercise.level,
              exercise.force,
              exercise.equipment,
              exercise.category,
            ].some((field) =>
              field?.toLowerCase().includes(text.toLowerCase())
            ) ||
            exercise.primaryMuscles.some((muscle) =>
              muscle.toLowerCase().includes(text.toLowerCase())
            )
        );
        setFilteredExercises(filteredData);
      } else {
        setFilteredExercises(exercises);
      }
    }, 300),
    [exercises]
  );

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  const isExercise = (item: any): item is Exercise => {
    return item.images && Array.isArray(item.images);
  };

  const renderExerciseItem = useCallback(
    ({ item }: ListRenderItemInfo<Exercise | Workout>) => (
      <ExerciseItem
        item={item}
        toggleBookmark={toggleBookmark}
        removeWorkout={removeWorkout}
        bookmarked={bookmarkedExercises.includes(item.id)}
        isExercise={isExercise}
      />
    ),
    [toggleBookmark, removeWorkout, bookmarkedExercises]
  );

  useEffect(() => {
    if (workouts.length === 0) {
      sendNotification("Wanna create a new Workout?", "Your workout list is empty. Add a workout to get started!");
    }            
  }, [workouts]);

  return (
    <ThemedView style={styles.container}>
      <MenuBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Browse" && (
        <>
          <SearchBar
            searchText={searchText}
            handleSearch={onChangeSearchText}
          />
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews
          />
        </>
      )}
      {activeTab === "Custom" && (
        <>
          {workouts?.length > 0 ? (
            <ThemedView style={styles.container}>
              <FlatList
                data={workouts}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
              />
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyContainer}>
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

const ExerciseItem = memo(
  ({ item, toggleBookmark, removeWorkout, bookmarked, isExercise }: any) => (
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
          <ThemedView style={styles.trashContainer}>
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
          name={bookmarked ? "bookmark" : "bookmark-outline"}
          size={18}
        />
      </Pressable>
    </Pressable>
  )
);

const MenuBar = memo(({ activeTab, setActiveTab }: any) => (
  <ThemedView style={styles.menuBar}>
    {["Custom", "Browse"].map((tab) => (
      <Pressable key={tab} onPress={() => setActiveTab(tab as any)}>
        <ThemedText
          style={[
            styles.menuOption,
            activeTab === tab && styles.activeMenuOption,
          ]}
        >
          {tab}
        </ThemedText>
      </Pressable>
    ))}
  </ThemedView>
));

const SearchBar = memo(({ searchText, handleSearch }: any) => (
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
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  trashContainer: { flexDirection: "row", justifyContent: "space-between" },
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    borderBottomColor: Colors.grey,
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
    backgroundColor: Colors.white,
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
    color: Colors.darkgray,
  },
  level: {
    fontSize: 12,
    color: Colors.darkgray,
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
    color: Colors.darkgray,
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
    color: Colors.white,
    fontWeight: "400",
  },
});

export default WorkoutScreen;
