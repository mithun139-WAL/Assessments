import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Photo = {
  id: string;
  uri: string;
  date: string;
  title: string;
};

type WorkoutRoute = {
  id: string;
  date: string;
  distance: number;
  routeCoordinates: { latitude: number; longitude: number }[];
};

type TrackingContextType = {
  photos: Photo[];
  workoutRoutes: WorkoutRoute[];
  addPhoto: (photo: Photo) => void;
  addWorkoutRoute: (route: WorkoutRoute) => void;
  removePhoto: (id: string) => void;
};

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [workoutRoutes, setWorkoutRoutes] = useState<WorkoutRoute[]>([]);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem("photos");
        const storedRoutes = await AsyncStorage.getItem("workoutRoutes");

        if (storedPhotos) {
          console.log("Stored Photos Fetched:", storedPhotos);
          setPhotos(JSON.parse(storedPhotos));
        }

        if (storedRoutes) {
          console.log("Stored Routes Fetched:", storedRoutes);
          setWorkoutRoutes(JSON.parse(storedRoutes));
        }
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      }
    };

    fetchTrackingData();
  }, []);

  useEffect(() => {
    const updatePhotos = async () => {
      try {
        await AsyncStorage.setItem("photos", JSON.stringify(photos));
        console.log("Photos Updated in AsyncStorage");
      } catch (error) {
        console.error("Error updating photos:", error);
      }
    };

    updatePhotos();
  }, [photos]);

  useEffect(() => {
    const updateRoutes = async () => {
      try {
        await AsyncStorage.setItem("workoutRoutes", JSON.stringify(workoutRoutes));
        console.log("Workout Routes Updated in AsyncStorage");
      } catch (error) {
        console.error("Error updating workout routes:", error);
      }
    };

    updateRoutes();
  }, [workoutRoutes]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const addWorkoutRoute = (route: WorkoutRoute) => {
    setWorkoutRoutes((prev) => [...prev, route]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  return (
    <TrackingContext.Provider
      value={{ photos, workoutRoutes, addPhoto, addWorkoutRoute, removePhoto }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }
  return context;
};
