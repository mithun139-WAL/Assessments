import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Photo = {
  id: string;
  uri: string;
  date: string;
  title: string;
  address?: string;
};

type TrackingContextType = {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
};

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [address, setAddress] = useState<string | "Not Available">("");

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem("photos");
        const storedLocation = await AsyncStorage.getItem("location");

        if (storedPhotos) {
          setPhotos(JSON.parse(storedPhotos));
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
      } catch (error) {
        console.error("Error updating photos:", error);
      }
    };

    updatePhotos();
  }, [photos]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const updateLocation = (newLocation: string) => {
    setAddress(newLocation);
  };

  return (
    <TrackingContext.Provider
      value={{ photos, addPhoto, removePhoto, }}
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
