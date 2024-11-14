import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ModalCalendar from './ModalCalendar';
import HistoryModal from './HistoryModal';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

moment.locale('es');

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarComponent({ profesionalId }) {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ start: null, end: null });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [totalHoursByWeek, setTotalHoursByWeek] = useState({});
  const [maxHoursByWeek, setMaxHoursByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null); // Nuevo estado para almacenar el historial seleccionado

  const getWeekId = useCallback((date) => moment(date).startOf('week').format('YYYY-MM-DD'), []);

  const fetchWeeklyHours = useCallback(async (weekId) => {
    if (!profesionalId) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/horas-semanales/${weekId}`, {
        params: { profesionalId },
      });
      
      if (res.status === 200) {
        setMaxHoursByWeek((prev) => ({ ...prev, [weekId]: res.data.horasSemanalesMaximas }));
        setTotalHoursByWeek((prev) => ({ ...prev, [weekId]: res.data.totalHorasTrabajadas }));
      }
    } catch (error) {
      console.error('Error al obtener las horas semanales:', error);
    }
  }, [profesionalId, getWeekId]);

  useEffect(() => {
    if (!profesionalId) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sesiones', {
          params: { profesionalId }
        });
        const adjustedEvents = res.data.map(event => ({
          ...event,
          title: '', 
          start: moment.utc(event.start).local().toDate(),
          end: moment.utc(event.end).local().toDate(),
        }));
        setEvents(adjustedEvents);
      } catch (error) {
        console.error('Error al cargar sesiones', error);
      }
    };

    fetchEvents();
    fetchWeeklyHours(getWeekId(currentWeek));
  }, [currentWeek, fetchWeeklyHours, getWeekId, profesionalId]);

  const handleSelectSlot = ({ start, end }) => {
    const weekId = getWeekId(start);
    const hoursDiff = (new Date(end) - new Date(start)) / (1000 * 60 * 60);
    const totalHours = totalHoursByWeek[weekId] || 0;
    const maxHours = maxHoursByWeek[weekId] || 0;

    if (totalHours + hoursDiff > maxHours) {
      alert(`No puedes asignar más de ${maxHours} horas semanales.`);
      return;
    }

    setNewEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const weekId = getWeekId(newEvent.start);
      const newEventHours = (new Date(newEvent.end) - new Date(newEvent.start)) / (1000 * 60 * 60);

      if (selectedEvent) {
        const res = await axios.put(`http://localhost:3000/api/sesiones/${selectedEvent._id}`, {
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
        });
        setEvents(events.map(evt => (evt._id === selectedEvent._id ? res.data : evt)));
      } else {
        const res = await axios.post('http://localhost:3000/api/sesiones', {
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
          profesional: profesionalId,
          horas: newEventHours,
        });
        setEvents([...events, res.data]);
      }

      const updatedTotalHours = (totalHoursByWeek[weekId] || 0) + newEventHours;
      await axios.post('http://localhost:3000/api/horas-semanales', {
        weekId,
        horasSemanalesMaximas: maxHoursByWeek[weekId],
        totalHorasTrabajadas: updatedTotalHours,
        profesional: profesionalId,
      });

      setTotalHoursByWeek({ ...totalHoursByWeek, [weekId]: updatedTotalHours });
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/sesiones/${selectedEvent._id}`);
      setEvents(events.filter(evt => evt._id !== selectedEvent._id));
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  const handleSendSchedule = async () => {
    try {
      const week_id = getWeekId(currentWeek); // Obtén el ID de la semana actual
      const eventsToSend = events.map((event) => ({
        ...event,
        start: event.start.toISOString(), // Formateo adecuado de fechas
        end: event.end.toISOString(),
      }));
  
      const response = await axios.post('http://localhost:3000/api/horarios', {
        week_id,
        profesionalId,
        events: eventsToSend,
      });
  
      alert('Horario enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el horario:', error);
      alert('Error al enviar el horario. Revisa la consola para más detalles.');
    }
  };
  
  
  // Previsualizar los eventos seleccionados del historial
  const handleHistorySelect = (historyEvents) => {
    const formattedEvents = historyEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
  }));

  setEvents(formattedEvents); // Actualizar el estado con los eventos seleccionados
  setSelectedHistory(historyEvents); // Marcar los eventos como seleccionados
  setIsHistoryModalOpen(false); // Cerrar el modal del historial
};
  
// Enviar horario desde la previsualización
const handleSendScheduleFromHistory = async () => {
  try {
    const week_id = getWeekId(currentWeek); // Nueva semana
    const eventsToSend = events.map((event) => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    }));

    await axios.post('http://localhost:3000/api/horarios', {
      week_id,
      profesionalId,
      events: eventsToSend,
    });

    alert('Horario enviado exitosamente desde el historial');
  } catch (error) {
    console.error('Error al enviar el horario desde el historial:', error);
  }
};


const handleDeleteSchedule = () => {
  setEvents([]); // Limpia los eventos del calendario
  setSelectedHistory(null); // Restablece el horario seleccionado
};

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
            onNavigate={(date) => setCurrentWeek(moment(date).startOf('week'))}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setNewEvent({ start: event.start, end: event.end, _id: event._id });
              setIsModalOpen(true);
            }}
            onEventDrop={handleSaveEvent}
            resizable
            min={new Date(2024, 2, 1, 8, 0)}
            max={new Date(2024, 2, 1, 20, 0)}
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSendSchedule} // Enviar los eventos creados
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Enviar Horario
          </button>

          <button
            onClick={() => setIsHistoryModalOpen(true)} // Abrir el historial
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          >
            Historial
          </button>

          {/* Mostrar estos botones solo si hay previsualización */}
          {selectedHistory && (
            <>
              <button
                onClick={handleDeleteSchedule} // Eliminar la previsualización
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              >
                Eliminar Horario
              </button>
              <button
                onClick={handleSendScheduleFromHistory} // Enviar horario del historial
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Enviar Horario del Historial
              </button>
            </>
          )}
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

        {isHistoryModalOpen && (
          <HistoryModal
            profesionalId={profesionalId}
            setIsHistoryModalOpen={setIsHistoryModalOpen}
            onEventSelect={handleHistorySelect} // Aquí asignamos la función
          />
        )}
      </div>
    </DndProvider>
  );
}

export default CalendarComponent;
