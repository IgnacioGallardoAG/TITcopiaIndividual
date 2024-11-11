const HorasSemanales = require('../models/HorasSemanales');

// Create
exports.createHorasSemanales = async (req, res) => {
    try {
        const horasSemanales = new HorasSemanales(req.body);
        await horasSemanales.save();
        res.status(201).json(horasSemanales);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read (Obtener todas las horas semanales)
exports.getAllHorasSemanales = async (req, res) => {
    try {
        const horasSemanales = await HorasSemanales.find();
        res.json(horasSemanales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read (Obtener horas semanales por ID)
exports.getHorasSemanalesById = async (req, res) => {
    try {
        const horasSemanales = await HorasSemanales.findById(req.params.id);
        if (!horasSemanales) return res.status(404).json({ message: 'Horas semanales no encontradas' });
        res.json(horasSemanales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateHorasSemanales = async (req, res) => {
    try {
        const horasSemanales = await HorasSemanales.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!horasSemanales) return res.status(404).json({ message: 'Horas semanales no encontradas' });
        res.json(horasSemanales);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete
exports.deleteHorasSemanales = async (req, res) => {
    try {
        const horasSemanales = await HorasSemanales.findByIdAndDelete(req.params.id);
        if (!horasSemanales) return res.status(404).json({ message: 'Horas semanales no encontradas' });
        res.json({ message: 'Horas semanales eliminadas' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
