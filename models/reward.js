const mongo = require("mongoose");

const rewardSchema = new mongo.Schema({
    all_badges_array: { type: String, required: true },
    session_reward: { type: Number, required: true },
    day_reward: { type: Number, required: true },
    total_reward: { type: Number, required: true },
    total_series: { type: Number, required: true },
    total_sessions: { type: Number, required: true },
    total_days: { type: Number, required: true },
    total_weeks: { type: Number, required: true },
    id_patient: { type: mongo.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true }
});

module.exports = mongo.model("Rewards", rewardSchema);