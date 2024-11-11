const express = require('express');
const router = express.Router();
const { getEvents, addEvent, updateEvent, updateWeeklyHours, getWeeklyHours, deleteEvent } = require('../controllers/Tit01-05_controllers');

// Ruta para obtener todos los eventos
router.get('/events', getEvents);

// Ruta para agregar un nuevo evento
router.post('/events', addEvent);

// Ruta para actualizar un evento existente
router.put('/events/:id', updateEvent);

//Para horas Semanales
// Ruta para actualizar o crear horas semanales
router.post('/weekly-hours', updateWeeklyHours);

// Ruta para obtener horas semanales por semana
router.get('/weekly-hours/:weekId', getWeeklyHours);

// Ruta para eliminar un evento
router.delete('/events/:id', deleteEvent);

module.exports = router;