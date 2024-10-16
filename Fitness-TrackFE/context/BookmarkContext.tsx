import { BookmarkContextType } from "@/exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [bookmarkedExercises, setBookmarkedExercises] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookmarkedExercises = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem(
          "bookmarkedExercises"
        );
        if (storedBookmarks)
          setBookmarkedExercises(JSON.parse(storedBookmarks));
      } catch (err) {
        console.error(
          "Failed to load bookmarked exercises from AsyncStorage",
          err
        );
      }
    };

    fetchBookmarkedExercises();
  }, []);

  const toggleBookmark = async (id: string) => {
    const updatedBookmarks = bookmarkedExercises.includes(id)
      ? bookmarkedExercises.filter((exerciseId) => exerciseId !== id)
      : [...bookmarkedExercises, id];

    setBookmarkedExercises(updatedBookmarks);

    try {
      await AsyncStorage.setItem(
        "bookmarkedExercises",
        JSON.stringify(updatedBookmarks)
      );
    } catch (err) {
      console.error("Failed to save BookMarks", err);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedExercises, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
