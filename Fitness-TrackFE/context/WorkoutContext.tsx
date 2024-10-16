import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Action,
  ExerciseLog,
  Goal,
  ProgressData,
  Workout,
  WorkoutContextType,
} from "@/exercise";

const initialState = {
  exerciseLogs: [] as ExerciseLog[],
  progressData: [] as ProgressData[],
  goals: [] as Goal[],
  workouts: [] as Workout[],
  selectedDate: new Date(),
};

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_EXERCISE_LOGS":
      return { ...state, exerciseLogs: action.payload };
    case "SET_PROGRESS_DATA":
      return { ...state, progressData: action.payload };
    case "SET_GOALS":
      return { ...state, goals: action.payload };
    case "SET_WORKOUTS":
      return { ...state, workouts: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    default:
      return state;
  }
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const API_URL = "https://fitness-be-70jr.onrender.com/api";

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([loadExerciseLogs(), loadProgressData(), loadGoals()]);
    };
    fetchData();
  }, []);

  const loadExerciseLogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/exerciseLogs`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_EXERCISE_LOGS", payload: data });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error fetching exercise logs:", error);
    }
  }, []);

  const loadProgressData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/progress`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_PROGRESS_DATA", payload: data });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  }, []);

  const loadGoals = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/goals`);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_GOALS", payload: data });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }, []);

  const addWorkoutLog = async (log: Omit<ExerciseLog, "id">) => {
    try {
      const response = await fetch(`${API_URL}/exerciseLogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "SET_EXERCISE_LOGS",
          payload: [...state.exerciseLogs, data],
        });
        updateGoalProgress(data);
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error adding workout log:", error);
    }
  };

  const updateProgress = async (progress: ProgressData) => {
    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progress),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "SET_PROGRESS_DATA",
          payload: [...state.progressData, data],
        });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const setGoal = async (goal: Omit<Goal, "id">) => {
    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goal),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_GOALS", payload: [...state.goals, data] });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error setting goal:", error);
    }
  };

  const removeGoal = async (goalId: number) => {
    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: "SET_GOALS",
          payload: state.goals.filter((goal) => goal.id !== goalId),
        });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error removing goal:", error);
    }
  };

  const removeWorkoutLog = async (exerciseId: number) => {
    try {
      const response = await fetch(`${API_URL}/exerciseLogs/${exerciseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: "SET_EXERCISE_LOGS",
          payload: state.exerciseLogs.filter((log) => log.id !== exerciseId),
        });
      } else {
        console.error("Error: Response not OK", response.status);
      }
    } catch (error) {
      console.error("Error removing ExerciseLog:", error);
    }
  };

  const updateGoalProgress = (exerciseLog: ExerciseLog) => {
    const targetMuscle = exerciseLog.muscle;
    dispatch({
      type: "SET_GOALS",
      payload: state.goals.map((goal) => {
        if (goal.name === targetMuscle) {
          const newProgress = Math.min(
            goal.progress + (exerciseLog.weight / goal.target) * 100,
            100
          );
          return { ...goal, progress: newProgress };
        }
        return goal;
      }),
    });
  };

  const loadWorkouts = useCallback(async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem("workouts");
      if (storedWorkouts) {
        dispatch({ type: "SET_WORKOUTS", payload: JSON.parse(storedWorkouts) });
      }
    } catch (error) {
      console.error("Failed to load workouts from AsyncStorage", error);
    }
  }, []);

  const addWorkout = async (workout: Workout) => {
    try {
      const updatedWorkouts = [...state.workouts, workout];
      dispatch({ type: "SET_WORKOUTS", payload: updatedWorkouts });
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Failed to add workout to AsyncStorage", error);
    }
  };

  const removeWorkout = async (id: string) => {
    try {
      const updatedWorkouts = state.workouts.filter(
        (workout) => workout.id !== id
      );
      dispatch({ type: "SET_WORKOUTS", payload: updatedWorkouts });
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Failed to remove workout from AsyncStorage", error);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  return (
    <WorkoutContext.Provider
      value={{
        exerciseLogs: state.exerciseLogs,
        progressData: state.progressData,
        goals: state.goals,
        workouts: state.workouts,
        selectedDate: state.selectedDate,
        setSelectedDate: (date: Date) =>
          dispatch({ type: "SET_SELECTED_DATE", payload: date }),
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
