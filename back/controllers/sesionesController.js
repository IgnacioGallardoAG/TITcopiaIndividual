const Sesiones = require('../models/Sesiones');

// Create
exports.createSesion = async (req, res) => {
    try {
        const { start, end, profesional } = req.body;
        const sesion = new Sesiones({ start, end, profesional });
        await sesion.save();
        res.status(201).json(sesion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read (Obtener todas las sesiones)
exports.getAllSesiones = async (req, res) => {
    try {
        const { profesionalId } = req.query;
        const query = profesionalId ? { profesional: profesionalId } : {};
        const sesiones = await Sesiones.find(query).populate('profesional');
        res.json(sesiones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read (Obtener sesión por ID)
exports.getSesionById = async (req, res) => {
    try {
        const { profesionalId } = req.query;
        const query = { _id: req.params.id };

        if (profesionalId) {
            query.profesional = profesionalId; // Agrega el filtro de profesional si está presente
        }

        const sesion = await Sesiones.findOne(query);

        if (!sesion) {
            return res.status(404).json({ message: 'Sesión no encontrada o no pertenece al profesional especificado' });
        }
        res.json(sesion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateSesion = async (req, res) => {
    try {
        const { start, end } = req.body;
        const sesion = await Sesiones.findById(req.params.id);
        if (!sesion) return res.status(404).json({ message: 'Sesión no encontrada' });

        // Actualiza solo los campos que cambian
        if (start) sesion.start = start;
        if (end) sesion.end = end;
        sesion.horas = (new Date(sesion.end) - new Date(sesion.start)) / (1000 * 60 * 60); // Recalcula las horas
        await sesion.save();

        res.json(sesion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
exports.deleteSesion = async (req, res) => {
    try {
        const { profesionalId } = req.query;
        const query = { _id: req.params.id };

        if (profesionalId) {
            query.profesional = profesionalId; // Agrega el filtro de profesional si está presente
        }

        const sesion = await Sesiones.findOneAndDelete(query);

        if (!sesion) {
            return res.status(404).json({ message: 'Sesión no encontrada o no pertenece al profesional especificado' });
        }
        res.json({ message: 'Sesión eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};