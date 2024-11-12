const mongoose = require('mongoose');

const SesionesSchema = new mongoose.Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    horas: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sesiones', SesionesSchema);
