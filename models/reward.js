const mongo = require("mongoose");

const rewardScheme = new mongo.Schema({
    all_badges_array: { type: String },
    session_reward: { type: Number },
    day_reward: { type: Number },
    total_reward: { type: Number },
    total_series: { type: Number },
    total_sessions: { type: Number },
    total_days: { type: Number },
    total_weeks: { type: Number },
    id_patient: { type: String }
});

module.exports = mongo.model("Rewards", rewardScheme);