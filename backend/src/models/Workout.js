const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'yoga', 'hiit', 'flexibility', 'sports', 'custom'],
      default: 'custom',
    },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: { type: Number, required: true }, // in minutes
    caloriesBurned: { type: Number, default: 0 },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number },
        reps: { type: Number },
        duration: { type: Number }, // in seconds
        restTime: { type: Number }, // in seconds
        weight: { type: Number }, // in kg
        notes: { type: String },
      },
    ],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    isAIGenerated: { type: Boolean, default: false },
    aiPrompt: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
