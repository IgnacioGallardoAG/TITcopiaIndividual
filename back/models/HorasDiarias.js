const mongoose = require('mongoose');

const HorasDiariasSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    horasAsignadas: { type: Number, required: true },
    horasMaxDia: { type: Number, required: true },
    horasSemanales: { type: mongoose.Schema.Types.ObjectId, ref: 'HorasSemanales' }
}, { timestamps: true });

module.exports = mongoose.model('HorasDiarias', HorasDiariasSchema);
