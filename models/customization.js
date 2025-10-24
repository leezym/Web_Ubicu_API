const mongo = require("mongoose");

const customizationSchema = new mongo.Schema({
    id_customization: { type: Number, required: true },
    id_item_fondos_array: { type: String, required: true },
    id_item_figuras_array: { type: String, required: true },
    all_fondos_items_array: { type: String, required: true },
    all_figuras_items_array: { type: String, required: true },
    id_patient: { type: mongo.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true }
});

module.exports = mongo.model("Customizations", customizationSchema);