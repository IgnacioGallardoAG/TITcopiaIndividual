import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserComponent({ onUserSelect }) {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
    id_profesional: '',
    id_persona: '',
    especialidad: '',
    horasContrato: '',
    horario: ''
});

  // Cargar lista de usuarios desde el backend
useEffect(() => {
    const fetchUsers = async () => {
        try {
        const res = await axios.get('http://localhost:3000/api/profesionales');
        setUsers(res.data);
        } catch (error) {
        console.error('Error al cargar usuarios:', error);
        }
    };
    fetchUsers();
}, []);

  // Manejo de formulario de nuevo usuario
const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Convertir horasContrato a número antes de enviarlo
        const newUserData = { ...newUser, horasContrato: Number(newUser.horasContrato) };
        const res = await axios.post('http://localhost:3000/api/profesionales', newUserData);
        setUsers([...users, res.data]);
        setNewUser({
        id_profesional: '',
        id_persona: '',
        especialidad: '',
        horasContrato: '',
        horario: ''
      }); // Limpiar formulario
    } catch (error) {
        console.error('Error al agregar usuario:', error);
    }
};

return (
    <div>
        <h2>Gestión de Profesionales</h2>
        <form onSubmit={handleAddUser}>
        <input
            type="text"
            placeholder="ID Profesional"
            value={newUser.id_profesional}
            onChange={(e) => setNewUser({ ...newUser, id_profesional: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="ID Persona"
            value={newUser.id_persona}
            onChange={(e) => setNewUser({ ...newUser, id_persona: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="Especialidad"
            value={newUser.especialidad}
            onChange={(e) => setNewUser({ ...newUser, especialidad: e.target.value })}
            required
        />
        <input
            type="number"
            placeholder="Horas de Contrato"
            value={newUser.horasContrato}
            onChange={(e) => setNewUser({ ...newUser, horasContrato: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="Horario (opcional)"
            value={newUser.horario}
            onChange={(e) => setNewUser({ ...newUser, horario: e.target.value })}
        />
        <button type="submit">Agregar Profesional</button>
        </form>

        <h3>Lista de Profesionales</h3>
        <ul>
            {users.map(user => (
                <li key={user._id} onClick={() => onUserSelect(user._id)}>
                    {user.id_profesional} - {user.especialidad}
            </li>
        ))}
        </ul>
    </div>
);
}

export default UserComponent;
