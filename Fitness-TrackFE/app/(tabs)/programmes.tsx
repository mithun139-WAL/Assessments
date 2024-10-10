import React, { useState, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import SetGoalsTab from "@/components/SetGoalsTab";
import LogWorkoutTab from "../../components/LogWorkoutTab";
import TrackProgressTab from "@/components/TrackProgressTab";
import { TabBarIcon } from "../../components/commonComponents/TabBarIcon";
import { Colors } from '../../constants/Colors';

export default function WorkoutLoggingScreen() {
  const [activeTab, setActiveTab] = useState<string>("Log Workout");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handlePrevDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDate);
  };
  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const renderActiveTab = (date: Date) => {    
    switch (activeTab) {
      case "Log Workout":
        return <LogWorkoutTab selectedDate={date} />;
      case "Track Progress":
        return <TrackProgressTab selectedDate={date} />;
      case "Set Goals":
        return <SetGoalsTab />;
      default:
        return <LogWorkoutTab selectedDate={date} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.dateContainer}>
          <Pressable onPress={handlePrevDay}>
            <TabBarIcon name="arrow-back" size={24} style={styles.arrow} />
          </Pressable>
          <ThemedView style={styles.dateContainer}>
            <ThemedText style={styles.day}>
              {selectedDate.getDate().toString().padStart(2, "0")}
            </ThemedText>
            <ThemedText style={styles.dateText}>
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </ThemedText>
            <ThemedText style={styles.dateText}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </ThemedText>
          </ThemedView>
          <Pressable onPress={handleNextDay}>
            <TabBarIcon name="arrow-forward" size={24} style={styles.arrow} />
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.tabContainer}>
        {["Log Workout", "Track Progress", "Set Goals"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <ThemedText style={styles.tabText}>{tab}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>
      {renderActiveTab(selectedDate)}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tab: { padding: 10, borderBottomWidth: 2, borderColor: "transparent" },
  activeTab: { borderColor: Colors.aqua },
  tabText: { fontSize: 16, fontWeight: "500" },
  arrow: {
    fontSize: 16,
    marginHorizontal: 20,
    backgroundColor: Colors.aqua,
    padding: 5,
    color: Colors.white,
    borderRadius: 30,
    elevation: 5,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    paddingHorizontal: 5,
  },
  day: {
    fontSize: 24,
    fontWeight: "200",
    paddingHorizontal: 5,
    paddingTop: 5, 
  },
  headerContainer: {
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 5,
    elevation: 1,
  },
});
