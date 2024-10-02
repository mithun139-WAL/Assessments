import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "../components/commonComponents/ThemedView";
import { ThemedText } from "../components/commonComponents/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { exercises } from "@/data/exercises";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { FontAwesome6 } from "@expo/vector-icons";
import { useBookmarks } from "@/context/BookmarkContext";


const { width, height } = Dimensions.get("window");

const WorkOutList = () => {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const selectedExercise = exercises.find(
    (exercise) => exercise.id === exerciseId
  );
  if (!selectedExercise) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { bookmarkedExercises, toggleBookmark } = useBookmarks();

  const toggleImage = () => {
    if (selectedExercise.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={toggleImage}>
          <Image
            source={selectedExercise.images[currentImageIndex]}
            style={styles.mainImage}
          />
        </Pressable>

        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "#000"]}
          style={styles.infoContainer}
        >
          <Pressable onPress={()=>toggleBookmark(selectedExercise.id)} style={styles.bookmark}>
            <TabBarIcon
              name={
                bookmarkedExercises.includes(selectedExercise.id)
                  ? "bookmark"
                  : "bookmark-outline"
              }
              size={18}
              color={Colors.white}
              style={{ fontWeight: "600" }}
            />
          </Pressable>
          <ThemedText style={styles.exerciseTitle}>
            {selectedExercise?.name}
          </ThemedText>
          <ThemedText style={styles.label}>
            <TabBarIcon name="walk" size={20} />{" "}
            <ThemedText style={styles.value}>
              {selectedExercise?.force}{" "}
            </ThemedText>
            <ThemedText style={styles.value}>
              {selectedExercise?.category}{" "}
            </ThemedText>
            <ThemedText style={styles.value}>
              {selectedExercise?.primaryMuscles.join(" ")}{" "}
            </ThemedText>
            {selectedExercise?.secondaryMuscles &&
              selectedExercise?.secondaryMuscles.length > 0 && (
                <ThemedText style={styles.value}>
                  {selectedExercise?.secondaryMuscles.join(" ")}
                </ThemedText>
              )}
          </ThemedText>
          <ThemedText style={styles.label}>
            <FontAwesome6 name="weight-hanging" size={20} />
            {"  "}
            <ThemedText style={styles.value}>
              {selectedExercise?.equipment}
            </ThemedText>
          </ThemedText>

          <ThemedText style={styles.instructionsHeader}>
            Instructions:
          </ThemedText>
          {selectedExercise?.instructions.map((instruction, index) => (
            <ThemedText key={index} style={styles.instruction}>
              {index + 1}. {instruction}
            </ThemedText>
          ))}
        </LinearGradient>
      </ScrollView>
    </ThemedView>
  );
};

export default WorkOutList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  mainImage: {
    width: width,
    height: height * 0.33,
    resizeMode: "cover",
    marginBottom: 15,
    marginTop: 50,
    opacity: 0.8,
  },
  bookmark: {
    position: "absolute",
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 40,
    marginTop: 10,
  },
  infoContainer: {
    width: width,
    height: height,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 20,
    marginTop: -15,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 15,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
    paddingBottom: 10,
  },
  value: {
    fontWeight: "normal",
    color: Colors.white,
    textTransform: "capitalize",
    fontSize: 14,
    letterSpacing: 1,
  },
  instructionsHeader: {
    fontSize: 18,
    marginTop: 15,
    color: Colors.white,
    letterSpacing: 1.2,
  },
  instruction: {
    fontSize: 14,
    marginVertical: 5,
    color: Colors.white,
    letterSpacing: 1,
  },
});
