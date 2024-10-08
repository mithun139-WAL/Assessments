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
import { Colors } from "../../constants/Colors";

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
          <ThemedView>
            <ThemedText style={styles.title}>Looking for more ?</ThemedText>
            <Pressable style={{paddingBottom: 30}} onPress={() => router.navigate("/(tabs)/workouts")}>
              <ThemedText style={styles.explore}>Explore Workouts</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <WorkoutCarousel exercises={exercises} plans={plans} />
    </ScrollView>
  );
}

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
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },
});
