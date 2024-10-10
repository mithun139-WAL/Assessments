import React, { useEffect, useState } from "react";
import { StyleSheet, Button, FlatList } from "react-native";
import { useTracking } from "../context/TrackingContext";
import * as Location from "expo-location";
import MapView, { Polyline, UrlTile } from "react-native-maps";
import { ThemedView } from "./commonComponents/ThemedView";
import { ThemedText } from "./commonComponents/ThemedText";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const LocationBased = () => {
  const { workoutRoutes, addWorkoutRoute } = useTracking();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTrackingLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (newLocation) => {
          if (isTracking) {
            setLocation(newLocation);
            setRouteCoordinates((prev) => [...prev, newLocation.coords]);
          }
        }
      );
    };

    startTrackingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setRouteCoordinates([]);
  };

  const stopTracking = () => {
    setIsTracking(false);
    const newRoute = {
      id: generateUUID(),
      date: new Date().toLocaleDateString(),
      distance: calculateDistance(),
      routeCoordinates: routeCoordinates,
    };
    addWorkoutRoute(newRoute);
  };

  const calculateDistance = (): number => {
    return routeCoordinates.length; // You may want to implement a real distance calculation here
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Workout Tracking</ThemedText>

      <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
      >
        {/* Using OpenStreetMap as the tile source */}
        <UrlTile
          urlTemplate="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="blue"
        />
      </MapView>

      <ThemedView style={styles.buttonContainer}>
        {isTracking ? (
          <Button title="Stop Tracking" onPress={stopTracking} />
        ) : (
          <Button title="Start Tracking" onPress={startTracking} />
        )}
      </ThemedView>

      <FlatList
        data={workoutRoutes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.routeItem}>
            <ThemedText>Date: {item.date}</ThemedText>
            <ThemedText>Distance: {item.distance} meters</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  map: { width: "100%", height: 300, marginBottom: 10 },
  buttonContainer: { marginVertical: 10 },
  routeItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
});

export default LocationBased;