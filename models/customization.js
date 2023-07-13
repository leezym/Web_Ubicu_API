const mongo = require("mongoose");

const customizationScheme = new mongo.Schema({
    id_customization: { type: Number },
    id_item_fondos_array: { type: String },
    id_item_figuras_array: { type: String },
    all_fondos_items_array: { type: String },
    all_figuras_items_array: { type: String },
    id_patient: { type: String }
});

module.exports = mongo.model("Customizations", customizationScheme);