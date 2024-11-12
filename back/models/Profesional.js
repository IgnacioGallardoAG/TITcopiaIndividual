const mongoose = require('mongoose');

const ProfesionalSchema = new mongoose.Schema({
    id_profesional: { type: String, required: true, unique: true },
    id_persona: { type: String, required: true },
    especialidad: { type: String, required: true },
    horasContrato: { type: Number, required: true },
    horario: { type: String }
});

module.exports = mongoose.model('Profesional', ProfesionalSchema);
