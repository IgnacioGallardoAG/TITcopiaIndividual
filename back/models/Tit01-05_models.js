const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true},
});

const weeklyHoursSchema = new mongoose.Schema({
    weekId: { type: String, required: true },  // ID de la semana (basado en la fecha)
    maxHours: { type: Number, required: true },  // Horas máximas permitidas para esa semana
    totalAssignedHours: { type: Number, required: true }  // Total de horas asignadas en esa semana
});

const Event = mongoose.model('Event', eventSchema, 'EventsCalendar');
const WeeklyHours = mongoose.model('WeeklyHours', weeklyHoursSchema);
module.exports = { Event, WeeklyHours };