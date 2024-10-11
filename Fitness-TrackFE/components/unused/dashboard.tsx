import React, { useState } from "react";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import ProgressPhotos from "@/app/ProgressPhotos";
import LocationBased from "@/components/unused/LocationBased";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/commonComponents/ThemedView";

const {width} = Dimensions.get('window');

const DashBoard = () => {
  const [activeTab, setActiveTab] = useState<"Photos" | "Tracking">("Photos");

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.tabContainer}>
        <Pressable
          onPress={() => setActiveTab("Photos")}
          style={[styles.tab, activeTab === "Photos" && styles.activeTab]}
        >
          <ThemedText style={styles.tabText}>Photos</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("Tracking")}
          style={[styles.tab, activeTab === "Tracking" && styles.activeTab]}
        >
          <ThemedText style={styles.tabText}>Workout Tracking</ThemedText>
        </Pressable>
      </ThemedView>

      {activeTab === "Photos" ? <ProgressPhotos /> : <LocationBased />}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  tab: { fontSize: 16,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 10,
    width: width * 0.4, },
  activeTab: { borderColor: Colors.aqua },
});

export default DashBoard;
