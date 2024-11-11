import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';
import ModalCalendar from './ModalCalendar';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

moment.locale('es');

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ start: null, end: null });
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado para edición
  const [totalHoursByWeek, setTotalHoursByWeek] = useState({}); // Almacenar horas por semana
  const [maxHoursByWeek, setMaxHoursByWeek] = useState({}); // Almacenar horas máximas por semana
  const [tempMaxHours, setTempMaxHours] = useState(''); // Valor temporal antes de confirmar
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week')); // Semana actual

  // Función para obtener el ID de la semana basado en la fecha de inicio
  const getWeekId = useCallback((date) => {
    return moment(date).startOf('week').format('YYYY-MM-DD');
  }, []);

  // Función para obtener las horas semanales desde la base de datos
  const fetchWeeklyHours = useCallback(async (weekId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/weekly-hours/${weekId}`);
      if (res.status === 200) {
        setMaxHoursByWeek((prevMaxHours) => ({ ...prevMaxHours, [weekId]: res.data.maxHours }));
        setTotalHoursByWeek((prevTotalHours) => ({ ...prevTotalHours, [weekId]: res.data.totalAssignedHours }));
      }
    } catch (error) {
      console.error('Error al obtener las horas semanales:', error);
    }
  }, []);

  // Efecto para cargar los eventos y las horas semanales de la semana actual
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/events');
        const adjustedEvents = res.data.map(event => ({
          ...event,
          start: moment.utc(event.start).local().toDate(),
          end: moment.utc(event.end).local().toDate(),
        }));
        setEvents(adjustedEvents);
      } catch (error) {
        console.error('Error al cargar eventos', error);
      }
    };
    fetchEvents();

    fetchWeeklyHours(getWeekId(currentWeek)); // Obtener horas semanales
  }, [currentWeek, fetchWeeklyHours, getWeekId]);

  // Función para confirmar el número de horas semanales y enviarlo al backend
  const handleUpdateMaxHours = useCallback(async () => {
    const hoursInt = parseInt(tempMaxHours, 10);
    if (hoursInt > 0 && hoursInt <= 40) {
      const weekId = getWeekId(currentWeek);
      try {
        const res = await axios.post('http://localhost:3000/api/weekly-hours', {
          weekId,
          maxHours: hoursInt,
          totalAssignedHours: totalHoursByWeek[weekId] || 0,
        });
        setMaxHoursByWeek((prevMaxHours) => ({ ...prevMaxHours, [weekId]: res.data.maxHours }));
      } catch (error) {
        console.error('Error al actualizar las horas semanales:', error);
      }
    } else {
      alert('Por favor ingrese un número de horas entre 1 y 40.');
    }
  }, [currentWeek, tempMaxHours, totalHoursByWeek, getWeekId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateMaxHours();
    }
  };

  // Función para seleccionar un rango de horas en el calendario
  const handleSelectSlot = ({ start, end }) => {
    const weekId = getWeekId(start);
    const hoursDiff = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // Diferencia en horas
    const totalHours = totalHoursByWeek[weekId] || 0;
    const maxHours = maxHoursByWeek[weekId] || 0;

    // Verificar si se sobrepasa el límite definido por el usuario
    if (totalHours + hoursDiff > maxHours) {
      alert(`No puedes asignar más de ${maxHours} horas semanales.`);
      return;
    }

    setNewEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({ start: event.start, end: event.end, _id: event._id });
    setIsModalOpen(true);
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const weekId = getWeekId(start); // Obtener el ID de la semana del evento modificado
    const hoursDiff = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // Diferencia en horas
    const totalHours = totalHoursByWeek[weekId] || 0;
    const maxHours = maxHoursByWeek[weekId] || 0;
  
    // Verificar si el movimiento sobrepasa las horas semanales permitidas
    const eventHours = (new Date(event.end) - new Date(event.start)) / (1000 * 60 * 60);
    const updatedTotalHours = totalHours - eventHours + hoursDiff;

    const originalWeekId = getWeekId(event.start);
    const newWeekId = getWeekId(start);

    if (originalWeekId !== newWeekId) {
      alert('No puedes mover un evento a otra semana.');
      return; // Evitar que se complete el movimiento si es otra semana
    }
  
    if (updatedTotalHours > maxHours) {
      alert(`No puedes asignar más de ${maxHours} horas semanales.`);
      return; // Cancelar el movimiento si excede las horas máximas
    }
  
    try {
      await axios.put(`http://localhost:3000/api/events/${event._id}`, {
        start: moment(start).utc().toDate(),
        end: moment(end).utc().toDate(),
      });
  
      // Actualizar el estado del evento y las horas totales
      const updatedEvent = { ...event, start, end };
      setEvents(events.map(evt => (evt._id === event._id ? updatedEvent : evt)));
      setTotalHoursByWeek({
        ...totalHoursByWeek,
        [weekId]: updatedTotalHours,
      });
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
    }
  };

  // Función para guardar el evento
  const handleSaveEvent = async () => {
    try {
      let res;
      const weekId = getWeekId(newEvent.start);
      const oldWeekId = selectedEvent ? getWeekId(selectedEvent.start) : null;
  
      // Calculamos la diferencia de horas del nuevo evento
      const newEventHours = (new Date(newEvent.end) - new Date(newEvent.start)) / (1000 * 60 * 60);
  
      // Si estamos modificando un evento, calculamos la diferencia de horas del evento anterior
      const oldEventHours = selectedEvent
        ? (new Date(selectedEvent.end) - new Date(selectedEvent.start)) / (1000 * 60 * 60)
        : 0;
  
      let updatedTotalHours = (totalHoursByWeek[weekId] || 0);
  
      // Restamos las horas antiguas si estamos editando un evento existente
      if (selectedEvent && oldWeekId === weekId) {
        updatedTotalHours -= oldEventHours;
      }
  
      // Si es un evento nuevo o estamos editando un evento, sumamos las nuevas horas
      updatedTotalHours += newEventHours;
  
      // Guardar o modificar evento en el backend
      if (selectedEvent) {
        // Si estamos modificando un evento existente
        res = await axios.put(`http://localhost:3000/api/events/${selectedEvent._id}`, {
          ...newEvent,
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
        });
        setEvents(events.map(evt => (evt._id === selectedEvent._id ? res.data : evt)));
      } else {
        // Si es un evento nuevo
        res = await axios.post('http://localhost:3000/api/events', {
          ...newEvent,
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
        });
        setEvents([...events, res.data]);
      }
  
      // Actualizamos el total de horas asignadas en el backend
      await axios.post('http://localhost:3000/api/weekly-hours', {
        weekId,
        maxHours: maxHoursByWeek[weekId],
        additionalHours: newEventHours - oldEventHours,  // Enviamos la diferencia de horas al backend
      });
  
      // Actualizamos el total de horas en el frontend
      setTotalHoursByWeek({ ...totalHoursByWeek, [weekId]: updatedTotalHours });
  
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };
  
  

  // Función para manejar la navegación por semanas
  const handleNavigate = (date) => {
    setCurrentWeek(moment(date).startOf('week'));
  };

  const handleDeleteEvent = async () => {
    try {
      // Obtener las horas del evento que se eliminará
      const hoursDiff = (new Date(selectedEvent.end) - new Date(selectedEvent.start)) / (1000 * 60 * 60);
      const weekId = getWeekId(selectedEvent.start);
      const updatedTotalHours = (totalHoursByWeek[weekId] || 0) - hoursDiff;
  
      // Eliminar el evento del backend usando el _id de MongoDB
      await axios.delete(`http://localhost:3000/api/events/${selectedEvent._id}`);
  
      // Eliminar el evento del estado local
      setEvents(events.filter(evt => evt._id !== selectedEvent._id));
  
      // Actualizar el total de horas en el backend
      await axios.post('http://localhost:3000/api/weekly-hours', {
        weekId,
        maxHours: maxHoursByWeek[weekId], // Mantener el límite de horas actual
        additionalHours: -hoursDiff,  // Restar las horas del evento eliminado
      });
  
      // Actualizamos el total de horas en el frontend
      setTotalHoursByWeek({ ...totalHoursByWeek, [weekId]: updatedTotalHours });
  
      // Cerrar el modal
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Sección para ingresar las horas semanales */}
        <div>
          <h2 className="text-center font-bold text-lg mb-4">Modificar Horas Semanales Permitidas</h2>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={tempMaxHours}
            onChange={(e) => setTempMaxHours(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa las horas semanales (máx. 40)"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded mt-4"
            onClick={handleUpdateMaxHours}
          >
            Actualizar Límite de Horas
          </button>
        </div>

        {/* Mostrar el calendario */}
        <div>
          <h2 className="text-center font-bold text-lg mb-4">Calendario de Horas Profesionales</h2>
          <p>Total de horas asignadas: {totalHoursByWeek[getWeekId(currentWeek)] || 0} / {maxHoursByWeek[getWeekId(currentWeek)] || 'Sin definir'}</p>
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor={(event) => new Date(event.start)}
            endAccessor="end"
            views={['week']}
            defaultView="week"
            style={{ height: 600 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent} // Selecciona el evento para editarlo
            onEventDrop={handleEventDrop}
            resizable
            min={new Date(2024, 2, 1, 8, 0)}  // Mínimo a las 8:00 AM
            max={new Date(2024, 2, 1, 20, 0)} // Máximo a las 8:00 PM
          />
        </div>

        {isModalOpen && (
          <ModalCalendar
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleSaveEvent={handleSaveEvent}
            setIsModalOpen={setIsModalOpen}
            handleDeleteEvent={handleDeleteEvent}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default CalendarComponent;
