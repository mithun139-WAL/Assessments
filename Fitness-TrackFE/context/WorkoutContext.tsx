import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ExerciseLog = {
  id: number;
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
  id: number;
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

const initialState = {
  exerciseLogs: [] as ExerciseLog[],
  progressData: [] as ProgressData[],
  goals: [] as Goal[],
  workouts: [] as Workout[],
  selectedDate: new Date(),
};

type Action =
  | { type: "SET_EXERCISE_LOGS"; payload: ExerciseLog[] }
  | { type: "SET_PROGRESS_DATA"; payload: ProgressData[] }
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "SET_WORKOUTS"; payload: Workout[] }
  | { type: "SET_SELECTED_DATE"; payload: Date };

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

const API_URL = "http://10.0.2.2:8005/api";

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

// useEffect(() => {
//   const fetchWorkoutData = async () => {
//     const logs = await AsyncStorage.getItem("exerciseLogs");
//     const progress = await AsyncStorage.getItem("progressData");
//     const savedGoals = await AsyncStorage.getItem("goals");

//     if (logs) setExerciseLogs(JSON.parse(logs));
//     if (progress) setProgressData(JSON.parse(progress));
//     if (savedGoals) setGoals(JSON.parse(savedGoals));
//   };

//   fetchWorkoutData();
// }, []);

// useEffect(() => {
//   AsyncStorage.setItem("exerciseLogs", JSON.stringify(exerciseLogs));
// }, [exerciseLogs]);

// useEffect(() => {
//   AsyncStorage.setItem("progressData", JSON.stringify(progressData));
// }, [progressData]);

// useEffect(() => {
//   AsyncStorage.setItem("goals", JSON.stringify(goals));
// }, [goals]);

// const addWorkoutLog = (log: Omit<ExerciseLog, "id">) => {
//   const newLog = { ...log, id: generateUUID() };
//   setExerciseLogs((prevLogs) => [...prevLogs, newLog]);
//   updateGoalProgress(newLog);
// };

// const setGoal = async (goal: Omit<Goal, "id">) => {
//   const newGoal = { ...goal, id: generateUUID() };
//   setGoals((prevGoals) => [...prevGoals, newGoal]);
// };

// const updateProgress = async (progress: ProgressData) => {
//   const newProgress = { ...progress, id: generateUUID() };
//   setProgressData((prevProgress) => [...prevProgress, newProgress]);
// };

// const removeWorkoutLog = (logId: string) => {
//   setExerciseLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
// };

// const removeGoal = async (goalId: string) => {
//   setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
// };
