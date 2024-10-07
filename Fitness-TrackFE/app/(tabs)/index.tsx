import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { exercises } from "../../data/exercises";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import workoutData from "../../data/workout.json";
import WorkoutCarousel from "@/components/WorkoutCarousel";
import { Dimensions, ScrollView, FlatList } from "react-native";

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
  images: ImageSourcePropType[];
};

const { width } = Dimensions.get("window");

const weeklyRoutine: Record<number, string[]> = {
  0: ["Shoulders", "Hamstrings"],
  1: ["Adductors", "Abdominals"],
  2: ["Biceps", "Chest"],
  3: ["Quadriceps", "Calves"],
  4: ["Traps", "Glutes", "Lats"],
  5: ["Forearms", "Triceps"],
  6: ["Stretching", "Cardio"],
};

const getExercisesForDay = (day: number): Exercise[] => {
  const targetMuscles = weeklyRoutine[day];
  const filteredExercises = exercises.filter((exercise: Exercise) =>
    targetMuscles.some((muscle) => {
      const lowerCaseMuscle = muscle.toLowerCase();
      return (
        exercise.primaryMuscles.includes(lowerCaseMuscle) ||
        exercise.secondaryMuscles.includes(lowerCaseMuscle) ||
        exercise.category.toLowerCase() === lowerCaseMuscle
      );
    })
  );
  return filteredExercises;
};

export default function HomeScreen() {
  const { exercises, plans } = workoutData;
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
  const [dailyExercises, setDailyExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const exercisesForToday = getExercisesForDay(currentDay).slice(0, 20);
    setDailyExercises(exercisesForToday);
  }, [currentDay]);

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
          {/* <ThemedText style={styles.value}>
            {item?.primaryMuscles.join(" ")}{" "}
            {item?.secondaryMuscles && item?.secondaryMuscles.length > 0 && (
              <ThemedText style={styles.value}>
                {item?.secondaryMuscles.join(" ")}
              </ThemedText>
            )}
          </ThemedText> */}
        </LinearGradient>
      </ThemedView>
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "flex-start" }}
    >
      <ThemedView>
        <ThemedView>
          <WorkoutCarousel exercises={exercises} plans={plans} />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.recommendationsContainer}>
        <ThemedText style={styles.subtitle}>
          Today's Workout Recommendations
        </ThemedText>
        <ThemedView style={{ flex: 1 }}>
          <FlatList
            data={dailyExercises}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            horizontal
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    width: 220,
  },
  title: {
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingVertical: 20,
    fontWeight: "600",
    color: "#ddd",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    color: "red",
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationCard: {
    position: "absolute",
    height: 300,
    margin: 10,
    width: 200,
    borderRadius: 10,
    justifyContent: "flex-end",
    paddingVertical: 30,
  },
  thumbnail: {
    height: 300,
    margin: 10,
    width: 200,
    borderRadius: 10,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
  },
  value: {
    fontWeight: "normal",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },
});
