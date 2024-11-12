const mongoose = require('mongoose');

const SesionesSchema = new mongoose.Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    profesional: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    horas: {
        type: Number,
        required: true,
        default: function () {
            // Calcula la diferencia en horas entre start y end
            return (new Date(this.end) - new Date(this.start)) / (1000 * 60 * 60);
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Sesiones', SesionesSchema);
