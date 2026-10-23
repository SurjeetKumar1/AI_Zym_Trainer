const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    weight: { type: Number }, // in kg
    bodyFat: { type: Number }, // percentage
    muscleMass: { type: Number }, // in kg
    chest: { type: Number }, // cm
    waist: { type: Number }, // cm
    hips: { type: Number }, // cm
    arms: { type: Number }, // cm
    thighs: { type: Number }, // cm
    workoutsCompleted: { type: Number, default: 0 },
    totalCaloriesBurned: { type: Number, default: 0 },
    totalWorkoutTime: { type: Number, default: 0 }, // in minutes
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
