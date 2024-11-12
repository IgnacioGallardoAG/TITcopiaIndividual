import React, { useState } from 'react';
import CalendarComponent from './CalendarComponent';
import UserComponent from './UserComponent';

function TI0105() {
  const [profesionalId, setProfesionalId] = useState(null);

  // Función para manejar la selección de un profesional en UserComponent
  const handleUserSelect = (id) => {
    setProfesionalId(id); // Actualiza el profesionalId seleccionado
  };

  return (
    <div className="main-container">
      
      {/* Componente de Selección de Usuario */}
      <UserComponent onUserSelect={handleUserSelect} />

      {/* Componente de Calendario (solo se muestra si hay un profesional seleccionado) */}
      {profesionalId ? (
        <CalendarComponent profesionalId={profesionalId} />
      ) : (
        <p>Seleccione un profesional para ver el calendario.</p>
      )}
    </div>
  );
}

export default TI0105;
