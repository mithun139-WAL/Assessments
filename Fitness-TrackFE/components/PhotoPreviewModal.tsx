import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useTracking } from "@/context/TrackingContext";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./commonComponents/ThemedText";
import { TabBarIcon } from "./commonComponents/TabBarIcon";

type PhotoPreviewModalProps = {
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
};

type Photo = {
  id: string;
  uri: string;
  date: string;
  title: string;
};

const { width } = Dimensions.get("window");

const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  visible,
  initialIndex,
  onClose,
}) => {
  const { photos, removePhoto } = useTracking();
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

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

  const handleDelete = (id: string) => {
    removePhoto(id);
    console.log("Pressed");
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <TabBarIcon name="trash" style={{ color: "red" }} />
        </Pressable>

        <Pressable onPress={()=>(console.log("Pressed")
        )}><ThemedText style={{color: "#000"}}>Button</ThemedText></Pressable>
      </ThemedView>

      <Image source={{ uri: item.uri }} style={styles.fullscreenImage} />
    </ThemedView>
  );

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <ThemedView style={styles.carouselContainer}>
            <Carousel
              width={width}
              height={width}
              data={photos}
              mode="parallax"
              onSnapToItem={(index) => setActiveIndex(index)}
              scrollAnimationDuration={800}
              loop={false}
              defaultIndex={initialIndex}
              renderItem={renderItem}
            />
            {renderPagination(photos.length)}
          </ThemedView>
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    width: width * 1.1,
    height: width,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  card: {
    width: width,
    height: width * 1.2,
    borderRadius: 15,
    backgroundColor: "#fff",
    margin: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  cardTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
  },
  fullscreenImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  paginationContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
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

export default PhotoPreviewModal;
