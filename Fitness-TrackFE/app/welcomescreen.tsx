import { ThemedText } from "@/components/commonComponents/ThemedText";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import CommonDropDown from "@/components/commonComponents/CommonDropDown";
import { CommonButton } from "../components/commonComponents/CommonButton";
import { Colors } from "@/constants/Colors";

const WelcomeScreen = () => {
  const [goal, setGoal] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [goalOpen, setGoalOpen] = useState<boolean>(false);
  const [experienceOpen, setExperienceOpen] = useState<boolean>(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={styles.formContainer}
      >
        <ThemedText style={styles.title}>
          Welcome to Fitness Tracker!
        </ThemedText>
        <ThemedText style={styles.subText}>
          Track your routines, set goals, and see your progress.
        </ThemedText>
        <CommonDropDown
          items={[
            { label: "Lose Weight", value: "lose_weight" },
            { label: "Build Muscle", value: "build_muscle" },
            { label: "Maintain Fitness", value: "maintain_fitness" },
          ]}
          placeholder="Select your fitness goal"
          onChangeValue={setGoal}
          open={goalOpen}
          setOpen={setGoalOpen}
        />
        <CommonDropDown
          items={[
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
          ]}
          placeholder="Select your experience level"
          onChangeValue={setExperience}
          open={experienceOpen}
          setOpen={setExperienceOpen}
        />
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title="Get Started"
          buttonStyle={styles.button}
          textStyle={{ color: Colors.white }}
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/",
              params: { goal, experience },
            })}
        />
        <ThemedText
          style={styles.skipLink}
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/",
              params: { goal: "maintain_fitness", experience: "beginner" },
            })
          }
        >
          Skip Setup
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer:{ flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    paddingVertical: 10,
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 50,
    marginBottom: 150,
  },
  button: {
    marginVertical: 20,
    backgroundColor: Colors.blue,
  },
  text: {
    marginVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: Colors.grey,
  },
  input: {
    width: "80%",
    height: 40,
    padding: 10,
    marginVertical: 10,
  },
  skipLink: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.aqua,
    textAlign: "center",
  },
  ignore: {
    fontSize: 8,
    fontWeight: "300",
    color: "orange",
    marginTop: 20,
    textAlign: "center",
  },
});

export default WelcomeScreen;
