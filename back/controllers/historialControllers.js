const Horario = require('../models/Historial'); // Importar el modelo de Horarios

// Controlador para guardar el horario completo (Enviar Horario)
exports.saveHorario = async (req, res) => {
  const { week_id, profesionalId, events } = req.body;

  try {
    let horario = await Horario.findOne({ week_id, profesionalId });

    if (horario) {
      horario.events = events; // Actualiza los eventos
      await horario.save();
    } else {
      horario = new Horario({ week_id, profesionalId, events });
      await horario.save();
    }

    res.status(200).json({ message: 'Horario guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el horario:', error);
    res.status(500).json({ message: 'Error al guardar el horario', error });
  }
};

  
// Controlador para obtener el historial de horarios
exports.getHistorial = async (req, res) => {
    const { profesionalId } = req.query; // Obtener el ID del profesional desde los parámetros

    try {
        // Buscar los horarios asociados al profesional y ordenarlos por semana
        const historial = await Horario.find({ profesionalId }).sort({ week_id: -1 });

        if (!historial.length) {
            return res.status(404).json({ message: 'No se encontraron horarios en el historial' });
        }

        res.status(200).json(historial); // Devolver el historial encontrado
    } catch (error) {
        console.error('Error al obtener el historial:', error);
        res.status(500).json({ message: 'Error al obtener el historial', error });
    }
};

