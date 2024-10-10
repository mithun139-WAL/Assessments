import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Video, ResizeMode } from "expo-av";
import { ThemedView } from "./commonComponents/ThemedView";
import { ThemedText } from "./commonComponents/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get("window");

type Exercise = {
  id: number;
  name: string;
  video: string;
};

type DayExercise = {
  id: number;
  weight: number;
  sets: number;
  unit: string;
};

type Day = {
  id: number;
  name: string;
  exercises: DayExercise[];
};

type Plan = {
  id: number;
  name: string;
  days: Day[];
};

type WorkoutCarouselProps = {
  exercises: Exercise[];
  plans: Plan[];
};

const getCurrentDayIndex = () => {
  const currentDay = new Date().getDay();
  return currentDay - 1;
};

const WorkoutCarousel: React.FC<WorkoutCarouselProps> = ({
  exercises,
  plans,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dayIndex = getCurrentDayIndex();

  const selectedPlan =
    dayIndex === 6
      ? plans.find((plan) => plan.name === "Maintenance")
      : plans.find((plan) => plan.name === "Plan A");

  const maintenanceWomenPlan = plans.find(
    (plan) => plan.name === "Maintenance (Women)"
  );

  const mapDayExercisesToExercises = (dayExercises: DayExercise[]) => {
    return dayExercises
      .map((dayExercise) =>
        exercises.find((exer) => exer.id === dayExercise.id)
      )
      .filter((exercise): exercise is Exercise => exercise !== undefined);
  };

  const renderPagination = (dataLength: number) => (
    <LinearGradient
      colors={["transparent", "transparent"]}
      style={styles.paginationContainer}
    >
      {Array.from({ length: dataLength }).map((_, index) => (
        <ThemedView
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </LinearGradient>
  );

  return (
    <ThemedView>
      {selectedPlan && (
        <ThemedView key={selectedPlan.id} style={styles.planContainer}>
          <ThemedText style={styles.planTitle}>{selectedPlan.name}</ThemedText>
          <ScrollView>
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={true}
              data={mapDayExercisesToExercises(selectedPlan.days[0].exercises)}
              onSnapToItem={(index) => setActiveIndex(index)}
              scrollAnimationDuration={1000}
              renderItem={({ item }: { item: Exercise }) => (
                <ThemedView style={styles.carouselItem}>
                  <Video
                    style={styles.video}
                    source={{uri:"https://player.vimeo.com/178052126"}}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    style={styles.overlay}
                  >
                    <ThemedText style={styles.exerciseName}>
                      {item.name}
                    </ThemedText>
                  </LinearGradient>
                </ThemedView>
              )}
            />
            {renderPagination(selectedPlan.days[0].exercises.length)}
          </ScrollView>
        </ThemedView>
      )}

      {maintenanceWomenPlan && (
        <ThemedView key={maintenanceWomenPlan.id} style={styles.planContainer}>
          <ThemedText style={styles.planTitle}>
            {maintenanceWomenPlan.name}
          </ThemedText>
          <ScrollView>
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={true}
              data={mapDayExercisesToExercises(
                maintenanceWomenPlan.days[0].exercises
              )}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setActiveIndex(index)}
              renderItem={({ item }: { item: Exercise }) => (
                <ThemedView style={styles.carouselItem}>
                  <Video
                    style={styles.video}
                    source={{ uri: item.video }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.5)"]}
                    style={styles.overlay}
                  >
                    <ThemedText style={styles.exerciseName}>
                      {item.name}
                    </ThemedText>
                  </LinearGradient>
                </ThemedView>
              )}
            />
            {renderPagination(
              mapDayExercisesToExercises(maintenanceWomenPlan.days[0].exercises)
                .length
            )}
          </ScrollView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  planContainer: {
    marginBottom: 30,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  carouselItem: {
    width: width,
    height: width / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  video: {
    width: "90%",
    height: "110%",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  overlay: {
    position: "absolute",
    height: "110%",
    margin: 10,
    width: "90%",
    borderRadius: 10,
    justifyContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  paginationContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems:"flex-end",
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: "100%",
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 2,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.blue,
  },
  inactiveDot: {
    backgroundColor: "#C0C0C0",
  },
});

export default WorkoutCarousel;
