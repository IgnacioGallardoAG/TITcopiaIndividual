import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [totalHoursByWeek, setTotalHoursByWeek] = useState({});
  const [maxHoursByWeek, setMaxHoursByWeek] = useState({});
  const [tempMaxHours, setTempMaxHours] = useState('');
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));

  // Función para obtener el ID de la semana
  const getWeekId = useCallback((date) => moment(date).startOf('week').format('YYYY-MM-DD'), []);

  // Obtener horas semanales de HorasSemanales
  const fetchWeeklyHours = useCallback(async (weekId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/horas-semanales/${weekId}`);
      if (res.status === 200) {
        setMaxHoursByWeek((prev) => ({ ...prev, [weekId]: res.data.horasSemanalesMaximas }));
        setTotalHoursByWeek((prev) => ({ ...prev, [weekId]: res.data.totalHorasTrabajadas }));
      }
    } catch (error) {
      console.error('Error al obtener las horas semanales:', error);
    }
  }, []);

  // Cargar sesiones (events) y horas semanales
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sesiones');
        const adjustedEvents = res.data.map(event => ({
          ...event,
          title: '', // Deja el título vacío para las sesiones
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
  }, [currentWeek, fetchWeeklyHours, getWeekId]);

  // Actualizar límite de horas semanales en HorasSemanales
  const handleUpdateMaxHours = useCallback(async () => {
    const hoursInt = parseInt(tempMaxHours, 10);
    if (hoursInt > 0 && hoursInt <= 40) {
      const weekId = getWeekId(currentWeek);
      try {
        const res = await axios.post('http://localhost:3000/api/horas-semanales', {
          weekId,
          horasSemanalesMaximas: hoursInt,
          totalHorasTrabajadas: totalHoursByWeek[weekId] || 0,
        });
        setMaxHoursByWeek((prev) => ({ ...prev, [weekId]: res.data.horasSemanalesMaximas }));
      } catch (error) {
        console.error('Error al actualizar las horas semanales:', error);
      }
    } else {
      alert('Por favor ingrese un número de horas entre 1 y 40.');
    }
  }, [currentWeek, tempMaxHours, totalHoursByWeek, getWeekId]);

  // Manejo de selección de rango en el calendario
  const handleSelectSlot = ({ start, end }) => {
    const weekId = getWeekId(start);
    const hoursDiff = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // Diferencia en horas
    const totalHours = totalHoursByWeek[weekId] || 0;
    const maxHours = maxHoursByWeek[weekId] || 0;

    if (totalHours + hoursDiff > maxHours) {
      alert(`No puedes asignar más de ${maxHours} horas semanales.`);
      return;
    }

    setNewEvent({ start, end });
    setIsModalOpen(true);
  };

  // Manejo de eventos
  const handleSaveEvent = async () => {
    try {
      let res;
      const weekId = getWeekId(newEvent.start);
      const oldWeekId = selectedEvent ? getWeekId(selectedEvent.start) : null;
      const newEventHours = (new Date(newEvent.end) - new Date(newEvent.start)) / (1000 * 60 * 60);
      const oldEventHours = selectedEvent
        ? (new Date(selectedEvent.end) - new Date(selectedEvent.start)) / (1000 * 60 * 60)
        : 0;

      let updatedTotalHours = totalHoursByWeek[weekId] || 0;

      if (selectedEvent && oldWeekId === weekId) {
        updatedTotalHours -= oldEventHours;
      }
      updatedTotalHours += newEventHours;

      if (selectedEvent) {
        res = await axios.put(`http://localhost:3000/api/sesiones/${selectedEvent._id}`, {
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
        });
        setEvents(events.map(evt => (evt._id === selectedEvent._id ? res.data : evt)));
      } else {
        res = await axios.post('http://localhost:3000/api/sesiones', {
          start: moment(newEvent.start).utc().toDate(),
          end: moment(newEvent.end).utc().toDate(),
        });
        setEvents([...events, res.data]);
      }

      await axios.post('http://localhost:3000/api/horas-semanales', {
        weekId,
        horasSemanalesMaximas: maxHoursByWeek[weekId],
        totalHorasTrabajadas: updatedTotalHours,
      });

      setTotalHoursByWeek({ ...totalHoursByWeek, [weekId]: updatedTotalHours });
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div>
          <h2 className="text-center font-bold text-lg mb-4">Modificar Horas Semanales Permitidas</h2>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={tempMaxHours}
            onChange={(e) => setTempMaxHours(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateMaxHours()}
            placeholder="Ingresa las horas semanales (máx. 40)"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded mt-4"
            onClick={handleUpdateMaxHours}
          >
            Actualizar Límite de Horas
          </button>
        </div>

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

        {isModalOpen && (
          <ModalCalendar
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleSaveEvent={handleSaveEvent}
            setIsModalOpen={setIsModalOpen}
            handleDeleteEvent={async () => {
              try {
                await axios.delete(`http://localhost:3000/api/sesiones/${selectedEvent._id}`);
                setEvents(events.filter(evt => evt._id !== selectedEvent._id));
                setIsModalOpen(false);
                setSelectedEvent(null);
              } catch (error) {
                console.error('Error al eliminar el evento:', error);
              }
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default CalendarComponent;
