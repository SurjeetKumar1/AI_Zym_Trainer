import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeExercise: "squat",
  repCount: 0,
  targetReps: 10,
  formScore: 100,
  feedbackMessage: "Ready to start",
  isSessionActive: false,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setActiveExercise: (state, action) => {
      state.activeExercise = action.payload;
      state.repCount = 0;
      state.feedbackMessage = "Ready to start";
    },
    incrementRep: (state) => {
      state.repCount += 1;
    },
    resetReps: (state) => {
      state.repCount = 0;
    },
    updateFormScore: (state, action) => {
      state.formScore = action.payload;
    },
    setFeedback: (state, action) => {
      state.feedbackMessage = action.payload;
    },
    startSession: (state) => {
      state.isSessionActive = true;
      state.repCount = 0;
      state.feedbackMessage = "Tracking active";
    },
    stopSession: (state) => {
      state.isSessionActive = false;
      state.feedbackMessage = "Session completed";
    },
  },
});

export const {
  setActiveExercise,
  incrementRep,
  resetReps,
  updateFormScore,
  setFeedback,
  startSession,
  stopSession,
} = workoutSlice.actions;

export default workoutSlice.reducer;
