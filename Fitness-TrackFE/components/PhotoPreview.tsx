import {
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "./commonComponents/ThemedView";
import { TabBarIcon } from "./commonComponents/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { CameraCapturedPicture } from "expo-camera";
import * as Location from "expo-location";
import CommonTextInput from "./commonComponents/CommonTextInput";
import { Coordinates } from "@/exercise";

const PhotoPreview = ({
  photo,
  handleRetakePhoto,
  handleSavePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleSavePhoto: (title: string, address: string) => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [displayCurrentAddress, setDisplayCurrentAddress] =
    useState<string>("");
  const [locationServicesEnabled, setLocationServicesEnabled] =
    useState<boolean>(false);
  const [locationButtonState, setLocationButtonState] = useState<
    "default" | "loading" | "fetched"
  >("default");

  const checkIfLocationEnabled = async (): Promise<void> => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location Not Enabled",
        "Please enable your Location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Enable", onPress: () => console.log("Enable Pressed") },
        ]
      );
    }
    setLocationServicesEnabled(enabled);
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" && !locationButtonState) {
        Alert.alert(
          "Permission Denied",
          "Allow the app to use location services",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;

        await reverseGeocodeWithTimeout({ latitude, longitude });
      }
    } catch (error) {
      console.error("Error getting location: ", error);
      Alert.alert("Error", "Unable to fetch location. Please try again later.");
    }
  };

  const reverseGeocodeWithTimeout = async (
    coords: Coordinates
  ): Promise<void> => {
    try {
      const retryLimit = 2;
      let attempt = 0;
      let response: Location.LocationGeocodedAddress[] | undefined;

      while (attempt < retryLimit) {
        try {
          const reverseGeocodePromise = Location.reverseGeocodeAsync(coords);
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Geocoding request timed out")),
              10000
            )
          );

          response = (await Promise.race([
            reverseGeocodePromise,
            timeoutPromise,
          ])) as Location.LocationGeocodedAddress[];

          if (response && Array.isArray(response)) {
            break;
          }
        } catch (error) {
          attempt += 1;
          console.warn(`Attempt ${attempt} failed: ${error}`);
        }
      }

      if (response && Array.isArray(response)) {
        for (let item of response) {
          let address = `${item.name}, ${item.street}, ${item.city}, ${item.postalCode}`;
          let newAddress = `${item.city}, ${item.postalCode}`;
          setDisplayCurrentAddress(newAddress || "Address not found");
        }
      } else {
        throw new Error("Unable to fetch address. All attempts failed.");
      }
    } catch (error) {
      console.error("Reverse Geocoding Error: ", error);
      setDisplayCurrentAddress(
        "Unable to fetch address. Please try again later."
      );
    }
  };

  const handleLocation = async () => {
    setLocationButtonState("loading");
    await checkIfLocationEnabled();
    await getCurrentLocation();
    setLocationButtonState("fetched");
  };

  console.log("Address", displayCurrentAddress);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.box}>
        <Image
          style={styles.imgContainer}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />

        <ThemedView style={styles.titleContainer}>
          <CommonTextInput
            placeholder="Enter Title"
            value={title}
            onChangeText={setTitle}
          />
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleRetakePhoto}>
            <TabBarIcon name="trash" size={24} style={{ color: "red" }} />
          </Pressable>

          {locationButtonState === "loading" ? (
            <ThemedView style={styles.button}>
              <ActivityIndicator size="small" color="#0000ff" />
            </ThemedView>
          ) : locationButtonState === "fetched" ? (
            <ThemedView style={styles.button}>
              <TabBarIcon
                name="checkmark"
                size={24}
                style={{ color: "green" }}
              />
            </ThemedView>
          ) : (
            <Pressable style={styles.button} onPress={() => handleLocation()}>
              <TabBarIcon
                name="location"
                size={24}
                style={{ color: Colors.blue }}
              />
            </Pressable>
          )}

          <Pressable
            style={[styles.button, !title && styles.disabledButton]}
            onPress={() =>
              title && handleSavePhoto(title, displayCurrentAddress)
            }
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
    backgroundColor: Colors.white,
  },
  box: {
    width: "95%",
    height: "85%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.white,
    elevation: 10,
    shadowColor: Colors.black,
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
    paddingVertical: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  disabledButton: { backgroundColor: Colors.grey, opacity: 0.3 },
  titleContainer: {
    width: "100%",
    justifyContent: "center",
  },
});

export default PhotoPreview;
