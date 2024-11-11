const Profesional = require('../models/Profesional');

// Create
exports.createProfesional = async (req, res) => {
    try {
        const profesional = new Profesional(req.body);
        await profesional.save();
        res.status(201).json(profesional);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read (Obtener todos los profesionales)
exports.getAllProfesionales = async (req, res) => {
    try {
        const profesionales = await Profesional.find();
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read (Obtener un profesional por ID)
exports.getProfesionalById = async (req, res) => {
    try {
        const profesional = await Profesional.findById(req.params.id);
        if (!profesional) return res.status(404).json({ message: 'Profesional no encontrado' });
        res.json(profesional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateProfesional = async (req, res) => {
    try {
        const profesional = await Profesional.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profesional) return res.status(404).json({ message: 'Profesional no encontrado' });
        res.json(profesional);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
exports.deleteProfesional = async (req, res) => {
    try {
        const profesional = await Profesional.findByIdAndDelete(req.params.id);
        if (!profesional) return res.status(404).json({ message: 'Profesional no encontrado' });
        res.json({ message: 'Profesional eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
