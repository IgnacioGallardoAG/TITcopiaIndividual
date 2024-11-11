const Sesiones = require('../models/Sesiones');

// Create
exports.createSesion = async (req, res) => {
    try {
        const sesion = new Sesiones(req.body);
        await sesion.save();
        res.status(201).json(sesion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read (Obtener todas las sesiones)
exports.getAllSesiones = async (req, res) => {
    try {
        const sesiones = await Sesiones.find();
        res.json(sesiones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read (Obtener sesión por ID)
exports.getSesionById = async (req, res) => {
    try {
        const sesion = await Sesiones.findById(req.params.id);
        if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada' });
        res.json(sesion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateSesion = async (req, res) => {
    try {
        const sesion = await Sesiones.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada' });
        res.json(sesion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
exports.deleteSesion = async (req, res) => {
    try {
        const sesion = await Sesiones.findByIdAndDelete(req.params.id);
        if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada' });
        res.json({ message: 'Sesión eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
