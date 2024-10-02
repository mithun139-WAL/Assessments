import React, { createContext, useContext, useState, ReactNode } from "react";

type BookmarkContextType = {
  bookmarkedExercises: string[];
  toggleBookmark: (id: string) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [bookmarkedExercises, setBookmarkedExercises] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedExercises((prevBookmarks) =>
      prevBookmarks.includes(id)
        ? prevBookmarks.filter((exerciseId) => exerciseId !== id)
        : [...prevBookmarks, id]
    );
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