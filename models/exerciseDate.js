const mongo = require("mongoose");

const exerciseDateSchema = new mongo.Schema({
    current_exercise_final_date: { type: String },
    current_exercise_date: { type: String },
    exercise_hour_array: { type: String },
    id_patient: { type: mongo.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true }
});

exerciseDateSchema.index({ id_patient: 1 });

module.exports = mongo.model("ExerciseDate", exerciseDateSchema);