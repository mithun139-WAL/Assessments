import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useTracking } from "@/context/TrackingContext";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { useLocalSearchParams, router } from "expo-router";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import { useHeaderHeight } from "@react-navigation/elements";

const { width, height } = Dimensions.get("window");

const PhotoDisplay: React.FC = () => {
  const { initialIndex } = useLocalSearchParams();
  const { photos, removePhoto } = useTracking();
  const [activeIndex, setActiveIndex] = useState<number>(Number(initialIndex));
  const [displayedPhotos, setDisplayedPhotos] = useState(photos);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    setDisplayedPhotos(photos);
  }, [photos]);

  useEffect(() => {
    if (activeIndex >= displayedPhotos.length) {
      setActiveIndex(Math.max(displayedPhotos.length - 1, 0));
    }
  }, [displayedPhotos]);

  const handleDeletePhoto = () => {
    if (displayedPhotos.length > 0) {
      const photoId = displayedPhotos[activeIndex]?.id;
      removePhoto(photoId);
      setDisplayedPhotos((prev) =>
        prev.filter((photo) => photo.id !== photoId)
      );
    }
  };

  useEffect(() => {
    if (displayedPhotos.length === 0) {
      router.back();
    }
  }, [displayedPhotos]); 

  return (
    <ThemedView style={[styles.modalContainer, { paddingTop: headerHeight }]}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.imageTitle}>
          {displayedPhotos[activeIndex]?.title || ""} - {displayedPhotos[activeIndex]?.address}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.carouselWrapper}>
        <Carousel
          width={width}
          height={height * 0.6}
          data={displayedPhotos}
          onSnapToItem={(index) => setActiveIndex(index)}
          scrollAnimationDuration={800}
          loop={false}
          defaultIndex={Math.max(
            0,
            Math.min(activeIndex, displayedPhotos.length - 1)
          )}
          renderItem={({ item }) => (
            <ThemedView style={styles.imgContainer}>
              <Image
                source={{ uri: item.uri }}
                style={styles.fullscreenImage}
              />
            </ThemedView>
          )}
        />
      </ThemedView>

      <ThemedView style={styles.menuBar}>
        <Pressable onPress={handleDeletePhoto} style={styles.trashButton}>
          <TabBarIcon name="trash" style={styles.trashIcon} />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    width: width,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  trashButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  trashIcon: {
    color: "red",
    fontSize: 24,
    marginRight: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 10,
  },
  trashText: {
    color: "red",
    fontSize: 18,
  },
  errorText: {
    color: "#ccc",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default PhotoDisplay;
