const {Event, WeeklyHours} = require('../models/Tit01-05_models');

// Controlador para obtener todos los eventos
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos', error });
    }
};

const addEvent = async (req, res) => {
    const { start, end } = req.body;

    const adjustedStart = new Date(start);
    const adjustedEnd = new Date(end);

    try {
        const newEvent = new Event({
            start: adjustedStart,
            end: adjustedEnd,
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar evento', error });
    }
};

// Controlador para actualizar un evento
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { start, end } = req.body;

    const adjustedStart = new Date(start);
    const adjustedEnd = new Date(end);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,  // ID de mongo
            { start: adjustedStart, end: adjustedEnd },
            { new: true }  // Retorna el documento actualizado
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        console.log('Evento actualizado:', updatedEvent);
        res.status(200).json(updatedEvent);  // Devuelve el evento actualizado
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el evento', error });
    }
};

// Controlador para eliminar un evento
const deleteEvent = async (req, res) => {
    const { id } = req.params; // Obtener el id desde req.params
    try {
        const event = await Event.findByIdAndDelete(id); // Buscar y eliminar por id
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.status(200).json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el evento', error });
    }
};

// Manejo de Horas semanales

const updateWeeklyHours = async (req, res) => {
    const { weekId, maxHours, additionalHours = 0 } = req.body;  // Asegurar que `additionalHours` tiene un valor por defecto
    try {
        // Buscar si ya existe un registro de horas para esta semana
        let weeklyHours = await WeeklyHours.findOne({ weekId });
        let newWeeklyHours = null;

        if (weeklyHours) {
            // Si ya existe, sumamos las horas adicionales a `totalAssignedHours`
            weeklyHours.totalAssignedHours = (weeklyHours.totalAssignedHours || 0) + additionalHours;

            // Actualizamos `maxHours` si es necesario
            weeklyHours.maxHours = maxHours;

            // Guardamos los cambios
            await weeklyHours.save();
        } else {
            // Si no existe, creamos un nuevo registro con las horas iniciales
            newWeeklyHours = new WeeklyHours({
                weekId,
                maxHours,
                totalAssignedHours: additionalHours,
            });

            await newWeeklyHours.save();
        }

        res.status(200).json(weeklyHours || newWeeklyHours); // Retorna el registro correcto
    } catch (error) {
        console.error('Error al actualizar las horas semanales:', error);
        res.status(500).json({ message: 'Error al actualizar las horas semanales', error });
    }
};

// Controlador para obtener las horas semanales para una semana específica
const getWeeklyHours = async (req, res) => {
    const { weekId } = req.params;
    try {
        const weeklyHours = await WeeklyHours.findOne({ weekId });
        if (!weeklyHours) {
            return res.status(404).json({ message: 'Horas semanales no encontradas' });
        }
        res.status(200).json(weeklyHours);
    } catch (error) {
        console.error('Error al obtener las horas semanales:', error);
        res.status(500).json({ message: 'Error al obtener las horas semanales', error });
    }
};

module.exports = { getEvents, addEvent, updateEvent, updateWeeklyHours, getWeeklyHours, deleteEvent };
