import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ExerciseLog = {
  id: string;
  muscle: string | undefined;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type ProgressData = {
  date: string;
  totalWeight: number;
  totalReps: number;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  progress: number;
};

type Workout = {
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

type WorkoutContextType = {
  exerciseLogs: ExerciseLog[];
  progressData: ProgressData[];
  goals: Goal[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addWorkoutLog: (log: Omit<ExerciseLog, "id">) => void;
  removeWorkoutLog: (logId: string) => void;
  updateProgress: (progress: ProgressData) => void;
  setGoal: (goal: Omit<Goal, "id">) => void;
  removeGoal: (goalId: string) => void;
  updateGoalProgress: (exerciseLog: ExerciseLog) => void;
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  removeWorkout: (id: string) => void;
  loadWorkouts: () => Promise<void>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      const logs = await AsyncStorage.getItem("exerciseLogs");
      const progress = await AsyncStorage.getItem("progressData");
      const savedGoals = await AsyncStorage.getItem("goals");

      if (logs) setExerciseLogs(JSON.parse(logs));
      if (progress) setProgressData(JSON.parse(progress));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };

    fetchWorkoutData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("exerciseLogs", JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  useEffect(() => {
    AsyncStorage.setItem("progressData", JSON.stringify(progressData));
  }, [progressData]);

  useEffect(() => {
    AsyncStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const addWorkoutLog = (log: Omit<ExerciseLog, "id">) => {
    const newLog = { ...log, id: generateUUID() };
    setExerciseLogs((prevLogs) => [...prevLogs, newLog]);
    updateGoalProgress(newLog);
  };

  const removeWorkoutLog = (logId: string) => {
    setExerciseLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
  };

  const updateProgress = (progress: ProgressData) => {
    const newProgress = { ...progress, id: generateUUID() };
    setProgressData((prevProgress) => [...prevProgress, newProgress]);
  };

  const setGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = { ...goal, id: generateUUID() };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const removeGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const updateGoalProgress = (exerciseLog: ExerciseLog) => {
    const targetMuscle = exerciseLog.muscle;
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.name === targetMuscle) {
          const newProgress = Math.min(
            goal.progress + (exerciseLog.weight / goal.target) * 100,
            100
          );
          return { ...goal, progress: newProgress };
        }
        return goal;
      })
    );
  };

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem("workouts");
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error("Failed to load workouts from AsyncStorage", error);
    }
  };

  const addWorkout = async (workout: Workout) => {
    try {
      const updatedWorkouts = [...workouts, workout];
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Failed to add workout to AsyncStorage", error);
    }
  };

  const removeWorkout = async (id: string) => {
    try {
      const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Failed to remove workout from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [workouts]);

  return (
    <WorkoutContext.Provider
      value={{
        exerciseLogs,
        progressData,
        goals,
        selectedDate,
        workouts,
        setSelectedDate,
        addWorkoutLog,
        removeWorkoutLog,
        updateProgress,
        setGoal,
        removeGoal,
        updateGoalProgress,
        addWorkout,
        removeWorkout,
        loadWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
