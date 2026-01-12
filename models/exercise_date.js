const mongo = require("mongoose");

const exerciseDateSchema = new mongo.Schema({
    current_exercise_final_date: { type: String, default: null },
    current_exercise_date: { type: String, default: null },
    exercise_hour_array: { type: String, default: null },
    id_patient: { type: mongo.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true }
});

module.exports = mongo.model("ExerciseDates", exerciseDateSchema);