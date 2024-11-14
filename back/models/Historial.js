const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
    week_id: { type: String, required: true }, // ID de la semana (formato YYYY-MM-DD)
    profesionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    events: [
        {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
    ],
}, { timestamps: true});


module.exports = mongoose.model('Horario', horarioSchema);