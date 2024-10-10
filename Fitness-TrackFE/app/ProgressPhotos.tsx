import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../components/commonComponents/ThemedView";
import { Colors } from "@/constants/Colors";
import GalleryView from "../components/GalleryView";
import PhotoPreviewModal from "../components/PhotoPreviewModal";

const ProgressPhotos: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const handleOpenModal = (index: number) => {
    setSelectedPhotoIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  return (
    <ThemedView style={styles.container}>
      <GalleryView onPressPhoto={handleOpenModal} />
      <PhotoPreviewModal
        visible={modalVisible}
        initialIndex={selectedPhotoIndex}
        onClose={handleCloseModal}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  captureButton: {
    backgroundColor: Colors.blue,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  buttonText: {
    color: Colors.white,
  },
});

export default ProgressPhotos;
