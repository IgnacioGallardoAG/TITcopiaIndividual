import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Navbar from './navbar';
import TI0103 from './TI01-03/TI01-03';
import TI0105 from './TI01-05/TI01-05';
import TI0106 from './TI01-06/TI01-06';
import TI0201 from './TI02-01/TI02-01';
import TI0202 from './TI02-02/TI02-02';

function App() {
  const [page, setPage] = useState('Home');
  const handleNavigation = (e, pageName) => {
    e.preventDefault();
    setPage(pageName);
  };

  return (
    <div className="bg-white text-black font-josefin">
      {/* Navbar */}
      <Navbar handleNavigation={handleNavigation} />
      <main className="flex-grow p-6">
        {page === 'Home' && <Home page={page} setPage={setPage} handleNavigation={handleNavigation} />}
        {page === 'TI01-03' && <TI0103 />}
        {page === 'TI01-05' && <TI0105 />}
        {page === 'TI01-06' && <TI0106 />}
        {page === 'TI02-01' && <TI0201 />}
        {page === 'TI02-02' && <TI0202 />}
      </main>
    </div>
  );
}

function Home({ page, setPage, handleNavigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>


      {/* Barra de búsqueda*/}
      <div className="mb-4">
        <div className="flex items-center w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar..."
            className="p-2 border rounded-l-md w-full"
            style={{ backgroundColor: '#f1f2f3', color: '#adadae' }}
          />
          <button className="p-2 bg-[#54595f] text-white hover:bg-[#45494c] rounded-r-md flex items-center justify-center" style={{ height: '2.5rem', width: '3rem' }}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>


      {/* Tipografía */}
      <h1 className="text-4xl font-bold mb-4 font-josefin">Título Principal</h1>
      <h2 className="text-2xl mb-4 text-[#d26745] font-josefin">Bajada de Título</h2>
      <p className="text-base mb-4 font-josefin">Texto de ejemplo.</p>
      <p className="text-base mb-4 font-josefin">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum,
        augue vel lacinia mollis, eros erat cursus urna, ornare malesuada nibh odio sit amet augue.
        Nulla scelerisque velit sed nisi mattis, nec accumsan orci egestas.
      </p>
      <h1 className="text-2xl font-bold mb-4">Ejemplo de Hipervínculo</h1>
      <p>
        Este es un <a href="https://www.ejemplo.com" target="_blank" className="text-[#cf4360] hover:underline">hipervínculo</a> que lleva a un sitio web.
      </p>



      {/* Botones */}
      <h2 className="text-2xl mt-6 mb-2 font-josefin">Botones</h2>
      <button className="bg-[#f2d65d] text-[#4A4A4A] py-2 px-4 rounded-full hover:bg-[#e09a50] hover:text-white transition-colors duration-300 mr-4 font-josefin">
        Botón Principal
      </button>
      <button className="bg-[#75AA5C] text-white py-2 px-4 rounded-full hover:bg-[#4983A4] hover:text-white transition-colors duration-300 font-josefin">
        Botón Secundario
      </button>



      {/* Formulario de Ejemplo */}
      <h2 className="text-2xl mt-6 mb-4 font-josefin text-center">Formulario de Ejemplo</h2>
      <form className="p-6 rounded-lg bg-[#f9f9f9] shadow-md border border-[#d77949] font-josefin">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-black">Nombre:</label>
          <input
            type="text"
            className="mb-2 p-3 border border-[#d77949] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#d77949] placeholder:text-gray-400"
            placeholder="Ingresa tu nombre"
          />
          <span className="text-red-500 text-xs">Campo requerido</span>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-black">Fecha de Nacimiento:</label>
          <input
            type="date"
            className="mb-2 p-3 border border-[#d77949] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#d77949]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-black">Número:</label>
          <input
            type="number"
            className="mb-2 p-3 border border-[#d77949] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#d77949]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-black">Selección Múltiple:</label>
          <select className="mb-2 p-3 border border-[#d77949] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#d77949]">
            <option value="">Selecciona una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-black">Selecciona una opción:</label>
          <div className="flex items-center">
            <label className="mr-4 flex items-center">
              <input type="radio" name="opcion" value="opcion1" className="mr-1" /> Opción 1
            </label>
            <label className="flex items-center">
              <input type="radio" name="opcion" value="opcion2" className="mr-1" /> Opción 2
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#f2d65d] text-[#4A4A4A] py-2 px-4 rounded-lg hover:bg-[#e09a50] font-semibold transition duration-200 ease-in-out">
            Enviar
          </button>
        </div>
      </form>



      {/* Tabla de Ejemplo */}
      <h2 className="text-2xl mt-6 mb-2 font-josefin">Tabla de Ejemplo</h2>
      <table className="min-w-full bg-white border border-[#d77949] rounded-lg shadow-lg">
        <thead>
          <tr className="bg-[#e09a50] text-white">
            <th className="py-2 px-4 border-b border-[#d77949]">Nombre</th>
            <th className="py-2 px-4 border-b border-[#d77949]">Fecha de Nacimiento</th>
            <th className="py-2 px-4 border-b border-[#d77949]">Número</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-[#f2d65d]">
            <td className="py-2 px-4 border-b border-[#d77949]">Juan Pérez</td>
            <td className="py-2 px-4 border-b border-[#d77949]">01/01/1990</td>
            <td className="py-2 px-4 border-b border-[#d77949]">123456789</td>
          </tr>
          <tr className="hover:bg-[#f2d65d]">
            <td className="py-2 px-4 border-b border-[#d77949]">María González</td>
            <td className="py-2 px-4 border-b border-[#d77949]">05/05/1985</td>
            <td className="py-2 px-4 border-b border-[#d77949]">987654321</td>
          </tr>
        </tbody>
      </table>



      {/* Deslizador de Ejemplo */}
      <h2 className="text-2xl mt-6 mb-2 font-josefin">Deslizador de Ejemplo</h2>
      <input
        type="range"
        min="0"
        max="100"
        className="w-full mb-4 accent-[#e09a50]"
      />



      {/* Desplegable de Ejemplo */}
      <h2 className="text-2xl mt-6 mb-2 font-josefin">Desplegable de Ejemplo</h2>
      <select className="mb-4 p-2 rounded border border-[#d77949] w-full">
        <option value="">Selecciona una opción</option>
        <option value="opcion1">Opción 1</option>
        <option value="opcion2">Opción 2</option>
      </select>



      {/* Muestra de Paleta de Colores */}
      <h2 className="text-2xl mt-6 mb-2">Paleta de Colores</h2>
      <div className="flex space-x-4">
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#f2d65d' }}></div>
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#4A4A4A' }}></div>
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#e09a50' }}></div>
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#75AA5C' }}></div>
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#4983A4' }}></div>
        <div className="w-24 h-24 rounded" style={{ backgroundColor: '#d26745' }}></div>
      </div>



      {/* Barra de Números de Página*/}
      <div className="flex justify-center mt-4">
        {page === 'Home' && (
          <>
            <button className="mx-2 bg-[#e09a50] text-white py-2 px-4 rounded-full hover:bg-[#f2d65d]">
              1
            </button>
            <button className="mx-2 bg-white text-[#4A4A4A] py-2 px-4 rounded-full hover:bg-[#f2d65d]">
              2
            </button>
            <button className="mx-2 bg-white text-[#4A4A4A] py-2 px-4 rounded-full hover:bg-[#f2d65d]">
              3
            </button>
          </>
        )}
      </div>



    </div>
  );
}

export default App;
