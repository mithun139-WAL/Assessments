import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { exercises } from "../../data/exercises";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import workoutData from "../../data/workout.json";
import WorkoutCarousel from "@/components/WorkoutCarousel";
import { ScrollView, FlatList } from "react-native";
import { Colors } from "../../constants/Colors";
import { Exercise } from "@/exercise";
import { weeklyRoutine } from "@/data/customWorkoutData";
import registerNNPushToken from "native-notify";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const getExercisesForDay = (
  day: number,
  goal: string | string[],
  experience: string | string[]
): Exercise[] => {
  const targetMuscles = weeklyRoutine[day as keyof typeof weeklyRoutine];

  const equipmentFilter = (exercise: Exercise) => {
    if (goal === "maintain_fitness") {
      return exercise.equipment === "body only";
    } else if (goal === "lose_weight") {
      return ["dumbbell", "machine", "cable"].includes(
        exercise.equipment || ""
      );
    }
    return true;
  };

  const experienceFilter = (exercise: Exercise) => {
    if (experience === "beginner") return exercise.level === "beginner";
    if (experience === "intermediate")
      return ["beginner", "intermediate"].includes(exercise.level);
    return true;
  };

  return exercises.filter((exercise: Exercise) =>
    targetMuscles.some((muscle) => {
      const lowerCaseMuscle = muscle.toLowerCase();
      return (
        (exercise.primaryMuscles.includes(lowerCaseMuscle) ||
          exercise.secondaryMuscles.includes(lowerCaseMuscle) ||
          exercise.category.toLowerCase() === lowerCaseMuscle) &&
        equipmentFilter(exercise) &&
        experienceFilter(exercise)
      );
    })
  );
};
const HomeScreen = () => {
  const { exercises, plans } = workoutData;
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([]);
  const { goal = "maintain_fitness", experience = "beginner" } =
    useLocalSearchParams();
  const { scheduleDailyReminder } = usePushNotifications();

  useEffect(() => {
    const exercisesForToday = getExercisesForDay(
      currentDay,
      goal,
      experience
    ).slice(0, 20);
    setDailyExercises(exercisesForToday);
  }, [currentDay, goal, experience]);

  useEffect(() => {
    scheduleDailyReminder();
  }, []);

  registerNNPushToken(24264, "s4P1ziwZhvu0kGe3xDJJNI");

  const renderItem = ({ item }: { item: Exercise }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/WorkOutList",
          params: { exerciseId: item.id },
        })
      }
    >
      <ThemedView style={styles.card}>
        <Image
          source={
            item.images && item.images[0]
              ? item.images[0]
              : require("../../assets/images/icon.png")
          }
          style={styles.thumbnail}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          style={styles.recommendationCard}
        >
          <ThemedText
            style={[
              styles.value,
              { fontSize: 22, fontWeight: "bold", paddingVertical: 10 },
            ]}
          >
            {item.name}
          </ThemedText>
          <ThemedText style={styles.value}>{item.category} </ThemedText>
        </LinearGradient>
      </ThemedView>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "flex-start" }}
    >
      <ThemedView style={styles.recommendationsContainer}>
        <ThemedText style={styles.subtitle}>
          Today's Workout Recommendations
        </ThemedText>
        <ThemedView style={styles.container}>
          <FlatList
            data={dailyExercises}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            horizontal
          />
          <ThemedView>
            <ThemedText style={styles.title}>Looking for more ?</ThemedText>
            <Pressable
              style={{ paddingBottom: 30 }}
              onPress={() => router.navigate("/(tabs)/workouts")}
            >
              <ThemedText style={styles.explore}>Explore Workouts</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <WorkoutCarousel exercises={exercises} plans={plans} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
  },
  title: {
    fontSize: 26,
    letterSpacing: 1,
    paddingVertical: 20,
    fontWeight: "600",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  explore: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.blue,
    color: Colors.white,
    width: 200,
    borderRadius: 30,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 18,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationCard: {
    position: "absolute",
    height: 300,
    margin: 10,
    width: 240,
    justifyContent: "flex-end",
    paddingVertical: 30,
  },
  thumbnail: {
    height: 300,
    margin: 10,
    width: 240,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
  value: {
    fontWeight: "normal",
    color: Colors.white,
    textTransform: "uppercase",
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
