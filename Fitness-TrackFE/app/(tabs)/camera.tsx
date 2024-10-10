import React, { useRef, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { TabBarIcon } from "@/components/commonComponents/TabBarIcon";
import PhotoPreview from "@/components/PhotoPreview";
import { useTracking } from "@/context/TrackingContext";
import { router } from "expo-router";

type Photo = {
  id: string;
  uri: string;
  date: string;
  title: string;
};

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const { addPhoto } = useTracking();

  if (!permission) {
    return <ThemedView />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.permissionContainer}>
        <ThemedText style={{ textAlign: "center", paddingVertical: 20 }}>
          set permissons to show Camera
        </ThemedText>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <ThemedText style={styles.permissionText}>
            Grant Permission
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const toggleCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const capturedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(capturedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);
  const handleSavePhoto = (title: string) => {
    if (photo) {
      const newPhoto: Photo = {
        id: generateUUID(),
        uri: photo.uri,
        title: title,
        date: new Date().toISOString(),
      };
      addPhoto(newPhoto);
      setPhoto(null);
    }
  };

  if (photo)
    return (
      <PhotoPreview
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleSavePhoto={handleSavePhoto}
      />
    );

  return (
    <ThemedView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <ThemedView style={styles.buttonContainer}>
          <Pressable
            onPress={() => router.navigate("/ProgressPhotos")}
            style={styles.captureButton}
          >
            <TabBarIcon
              name="albums-sharp"
              size={30}
              style={styles.captureText}
            />
          </Pressable>
          <Pressable onPress={handleTakePhoto} style={styles.captureButton}>
            <TabBarIcon
              name="radio-button-on-sharp"
              size={70}
              style={styles.captureText}
            />
          </Pressable>
          <Pressable onPress={toggleCamera} style={styles.captureButton}>
            <TabBarIcon
              name="camera-reverse"
              size={30}
              style={styles.captureText}
            />
          </Pressable>
        </ThemedView>
      </CameraView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  captureButton: { flex: 1, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' },
  captureText: {
    color: "#fff",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionButton: { backgroundColor: "orange", padding: 10, width: "50%" },
  permissionText: { color: "white", textAlign: "center" },
  photoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});

export default Camera;
