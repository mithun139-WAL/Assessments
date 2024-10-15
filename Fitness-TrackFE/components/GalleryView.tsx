import React, { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";
import { useTracking } from "@/context/TrackingContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedView } from "./commonComponents/ThemedView";
import { ThemedText } from "./commonComponents/ThemedText";
import { Colors } from '../constants/Colors';

const GalleryView: React.FC = () => {
  const { photos } = useTracking();

  const handlePressPhoto = (index: number) => {
    router.push({
      pathname: "/PhotoDisplay",
      params: { initialIndex: index },
    });
  };

  if (photos.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>No Photos Available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={4}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => handlePressPhoto(index)}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignContent: "center" },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 1,
  },
  errorText: {
    color: Colors.grey,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default GalleryView;
