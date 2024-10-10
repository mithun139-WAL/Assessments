import {
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "./commonComponents/ThemedView";
import { TabBarIcon } from "./commonComponents/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { CameraCapturedPicture } from "expo-camera";

const PhotoPreview = ({
  photo,
  handleRetakePhoto,
  handleSavePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleSavePhoto: (title: string) => void;
}) => {
  const [title, setTitle] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.box}>
        <Image
          style={styles.imgContainer}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />

        <ThemedView style={styles.buttonContainer}>
          <ThemedView style={styles.titleContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />
          </ThemedView>
          <Pressable style={styles.button} onPress={handleRetakePhoto}>
            <TabBarIcon name="trash" size={24} style={{color: "red"}} />
          </Pressable>
          <Pressable
            style={[styles.button, !title && styles.disabledButton, ]}
            onPress={() => title && handleSavePhoto(title)}
            disabled={!title}
          >
            <TabBarIcon name="save" size={24} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  box: {
    width: "95%",
    height: "80%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imgContainer: {
    width: "100%",
    height: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginVertical: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  disabledButton: { backgroundColor: "#ccc", opacity: 0.3 },
  titleContainer: {
    width: "70%",
    justifyContent: "center",
  },
  textInput: {
    borderBottomColor: "darkgrey",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default PhotoPreview;
