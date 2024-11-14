import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // Asegúrate de instalar la librería si no está: npm install moment

function HistoryModal({ profesionalId, setIsHistoryModalOpen, onEventSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/horarios/historial', {
          params: { profesionalId },
        });
        setHistory(res.data);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }
    };

    fetchHistory();
  }, [profesionalId]);

  const handlePreviewConfirmation = (historyEvents) => {
    if (window.confirm('¿Quiere ver la previsualización del horario?')) {
      onEventSelect(historyEvents); // Llama a la función para ajustar las fechas y mostrar la previsualización
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Historial de Horarios</h2>
        <ul>
          {history.map((week) => {
            // Calculo del rango de fechas basado en el week_id
            const startOfWeek = moment(week.week_id).startOf('week'); // Primer día de la semana
            const endOfWeek = moment(week.week_id).endOf('week'); // Último día de la semana

            return (
              <li key={week.week_id}>
                <button
                  onClick={() => handlePreviewConfirmation(week.events)}
                  className="text-blue-500 underline"
                >
                  Semana del {startOfWeek.format('DD/MM')} al {endOfWeek.format('DD/MM')}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => setIsHistoryModalOpen(false)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default HistoryModal;
