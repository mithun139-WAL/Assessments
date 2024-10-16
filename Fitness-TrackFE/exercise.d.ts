export type Exercise = {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: any[];
};

export type Workout = {
  id: string;
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions: string[];
  category: string;
};

export type Photo = {
  id: string;
  uri: string;
  date: string;
  title: string;
  address?: string;
};

export type ExerciseLog = {
  id: number;
  muscle: string | undefined;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

export type ProgressData = {
  date: string;
  totalWeight: number;
  totalReps: number;
};

export type Goal = {
  id: number;
  name: string;
  target: number;
  progress: number;
};

export type WorkoutContextType = {
  exerciseLogs: ExerciseLog[];
  progressData: ProgressData[];
  goals: Goal[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addWorkoutLog: (log: Omit<ExerciseLog, "id">) => void;
  removeWorkoutLog: (logId: number) => void;
  updateProgress: (progress: ProgressData) => void;
  setGoal: (goal: Omit<Goal, "id">) => void;
  removeGoal: (goalId: number) => void;
  updateGoalProgress: (exerciseLog: ExerciseLog) => void;
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  loadWorkouts: () => Promise<void>;
};

export type Action =
  | { type: "SET_EXERCISE_LOGS"; payload: ExerciseLog[] }
  | { type: "SET_PROGRESS_DATA"; payload: ProgressData[] }
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "SET_WORKOUTS"; payload: Workout[] }
  | { type: "SET_SELECTED_DATE"; payload: Date };

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthContextProps {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOutUser: () => Promise<boolean>;
}

export type BookmarkContextType = {
  bookmarkedExercises: string[];
  toggleBookmark: (id: string) => void;
};

export type TrackingContextType = {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WorkoutCarouselProps = {
  exercises: Exercises[];
  plans: Plan[];
};

export type Day = {
  id: number;
  name: string;
  exercises: DayExercise[];
};

export type Plan = {
  id: number;
  name: string;
  days: Day[];
};

export type DayExercise = {
  id: number;
  weight: number;
  sets: number;
  unit: string;
};

export type Exercises = {
  id: number;
  name: string;
  video: string;
};