const mongoose = require('mongoose');

const HorasSemanalesSchema = new mongoose.Schema({
    week_id: { type: String, required: true },
    totalHorasTrabajadas: { type: Number, required: true },
    horasSemanalesMaximas: { type: Number, required: true },
    profesional: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional' }
}, { timestamps: true });

module.exports = mongoose.model('HorasSemanales', HorasSemanalesSchema);
