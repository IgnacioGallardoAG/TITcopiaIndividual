const HorasSemanales = require('../models/HorasSemanales');
const Profesional = require('../models/Profesional'); 

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
        const { weekId } = req.params; // Obtén el weekId de los parámetros de la URL
        const { profesionalId } = req.query; // Obtén el profesionalId de los parámetros de consulta

        if (!profesionalId) {
            return res.status(400).json({ message: 'profesionalId es requerido' });
        }

        // Construye el objeto de consulta
        const query = { week_id: weekId, profesional: profesionalId };
        
        // Busca el documento de horas semanales con el weekId y profesionalId proporcionados
        let horasSemanales = await HorasSemanales.findOne(query);
        
        // Si no existe, crea el documento
        if (!horasSemanales) {
            // Consulta el modelo Profesional para obtener las horas de contrato del profesional
            const profesional = await Profesional.findById(profesionalId);
            if (!profesional) {
                return res.status(404).json({ message: 'Profesional no encontrado' });
            }

            // Usa horasContrato como horasSemanalesMaximas para esta semana
            horasSemanales = new HorasSemanales({
                week_id: weekId,
                profesional: profesionalId,
                totalHorasTrabajadas: 0,
                horasSemanalesMaximas: profesional.horasContrato // Asigna horas de contrato del profesional
            });

            // Guarda el nuevo documento en la base de datos
            await horasSemanales.save();
        }

        // Devuelve el registro de horas semanales encontrado o creado
        res.json(horasSemanales);
    } catch (error) {
        console.error('Error al obtener o crear las horas semanales:', error);
        res.status(500).json({ message: 'Error al obtener o crear las horas semanales', error: error.message });
    }
};

// Update
exports.updateHorasSemanales = async (req, res) => {
    try {
        const { weekId } = req.params; // Obtener weekId de los parámetros de la URL
        const { profesionalId } = req.query; // Obtener profesionalId de los parámetros de consulta

        // Construye la consulta para encontrar el documento basado en weekId y profesionalId
        const query = { week_id: weekId, profesional: profesionalId };

        // Actualiza el documento encontrado usando los datos en el cuerpo de la solicitud
        const horasSemanales = await HorasSemanales.findOneAndUpdate(query, req.body, { new: true });

        if (!horasSemanales) return res.status(404).json({ message: 'Horas semanales no encontradas' });

        res.json(horasSemanales);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete
exports.deleteHorasSemanales = async (req, res) => {
    try {
        const { weekId } = req.params; // Obtener weekId de los parámetros de la URL
        const { profesionalId } = req.query; // Obtener profesionalId de los parámetros de consulta

        // Construye la consulta para encontrar y eliminar el documento basado en weekId y profesionalId
        const query = { week_id: weekId, profesional: profesionalId };

        // Encuentra y elimina el documento que coincida con la consulta
        const horasSemanales = await HorasSemanales.findOneAndDelete(query);

        if (!horasSemanales) return res.status(404).json({ message: 'Horas semanales no encontradas' });

        res.json({ message: 'Horas semanales eliminadas' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};