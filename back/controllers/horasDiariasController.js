const HorasDiarias = require('../models/HorasDiarias');

// Create
exports.createHorasDiarias = async (req, res) => {
    try {
        const horasDiarias = new HorasDiarias(req.body);
        await horasDiarias.save();
        res.status(201).json(horasDiarias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read (Obtener todas las horas diarias)
exports.getAllHorasDiarias = async (req, res) => {
    try {
        const horasDiarias = await HorasDiarias.find();
        res.json(horasDiarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read (Obtener horas diarias por ID)
exports.getHorasDiariasById = async (req, res) => {
    try {
        const horasDiarias = await HorasDiarias.findById(req.params.id);
        if (!horasDiarias) return res.status(404).json({ message: 'Horas diarias no encontradas' });
        res.json(horasDiarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateHorasDiarias = async (req, res) => {
    try {
        const horasDiarias = await HorasDiarias.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!horasDiarias) return res.status(404).json({ message: 'Horas diarias no encontradas' });
        res.json(horasDiarias);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
exports.deleteHorasDiarias = async (req, res) => {
    try {
        const horasDiarias = await HorasDiarias.findByIdAndDelete(req.params.id);
        if (!horasDiarias) return res.status(404).json({ message: 'Horas diarias no encontradas' });
        res.json({ message: 'Horas diarias eliminadas' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
