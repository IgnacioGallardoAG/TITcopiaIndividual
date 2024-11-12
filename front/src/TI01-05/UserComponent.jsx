import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UserComponent() {
const [users, setUsers] = useState([]);
const [newUser, setNewUser] = useState({ name: '', email: '' });

  // Cargar lista de usuarios desde el backend
useEffect(() => {
    const fetchUsers = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/users');
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
        const res = await axios.post('http://localhost:3000/api/users', newUser);
        setUsers([...users, res.data]);
        setNewUser({ name: '', email: '' }); // Limpiar formulario
    } catch (error) {
        console.error('Error al agregar usuario:', error);
    }
};

return (
    <div>
        <h2>Gestión de Usuarios</h2>
        <form onSubmit={handleAddUser}>
        <input
            type="text"
            placeholder="Nombre"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button type="submit">Agregar Usuario</button>
        </form>

        <h3>Lista de Usuarios</h3>
        <ul>
        {users.map(user => (
            <li key={user._id}>{user.name} - {user.email}</li>
        ))}
        </ul>
    </div>
    );
}

export default UserComponent;
