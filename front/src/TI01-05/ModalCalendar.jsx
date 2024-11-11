import moment from 'moment';
import React from 'react';

function ModalCalendar({ newEvent, setNewEvent, handleSaveEvent, setIsModalOpen, handleDeleteEvent }) {
  const minTime = moment(newEvent.start).format('YYYY-MM-DDT08:00'); // Limita inicio a las 08:00
  const maxTime = moment(newEvent.start).format('YYYY-MM-DDT19:00'); // Limita fin a las 20:00
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar/Editar Horario de Trabajo</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEvent();
          }}
        >
          <label className="block mb-2">
            Inicio:
            <input
              type="datetime-local"
              className="border p-2 rounded w-full"
              value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
              min={minTime}
              max={maxTime}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
            />
          </label>
          <label className="block mb-4">
            Fin:
            <input
              type="datetime-local"
              className="border p-2 rounded w-full"
              value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
              min={minTime}
              max={maxTime}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Guardar Evento
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
          {/* Mostrar el botón de eliminar solo si el evento ya tiene un _id */}
          {newEvent._id && (
            <button
              type="button"
              onClick={handleDeleteEvent} // Llamar la función para eliminar el evento
              className="bg-red-500 text-white p-2 rounded mt-2"
            >
              Eliminar Evento
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ModalCalendar;
