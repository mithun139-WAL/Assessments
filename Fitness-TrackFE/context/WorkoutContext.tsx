import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ExerciseLog = {
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

type WorkoutContextType = {
  exerciseLogs: ExerciseLog[];
  progressData: ProgressData[];
  goals: Goal[];
  addWorkoutLog: (log: ExerciseLog) => void;
  updateProgress: (progress: ProgressData) => void;
  setGoal: (goal: Goal) => void;
  removeGoal: (goalId: string) => void;
  updateGoalProgress: (exerciseLog: ExerciseLog) => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

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


  const addWorkoutLog = (log: ExerciseLog) => {
    setExerciseLogs((prevLogs) => [...prevLogs, log]);
    updateGoalProgress(log);
  };

  const updateProgress = (progress: ProgressData) => {    
    setProgressData((prevProgress) => [...prevProgress, progress]);
  };

  const setGoal = (goal: Goal) => {
    setGoals((prevGoals) => [...prevGoals, goal]);
  };

  const removeGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const updateGoalProgress = (exerciseLog: ExerciseLog) => {
    const targetMuscle = exerciseLog.exercise;
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

  return (
    <WorkoutContext.Provider
      value={{
        exerciseLogs,
        progressData,
        goals,
        addWorkoutLog,
        updateProgress,
        setGoal,
        removeGoal,
        updateGoalProgress,
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
