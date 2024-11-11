import React, { useState } from 'react';

const Navbar = ({ handleNavigation }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = (e, section) => {
    e.preventDefault();
    setActiveSection(section); // Cambiar la sección activa
    handleNavigation(e, section); // Navegar a la página seleccionada
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true); // Mostrar el menú desplegable al pasar el mouse
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false); // Ocultar el menú al salir el mouse
  };

  return (
    <nav className="bg-white p-0 shadow-none">
      <ul className="flex w-full">
        {['Home', 'TI01-03', 'TI01-05', 'TI01-06', 'TI02-01', 'TI02-02'].map((section) => (
          <li
            key={section}
            className="flex-grow relative"
            onMouseEnter={section === 'Home' ? handleMouseEnter : null} // Mostrar menú desplegable
            onMouseLeave={section === 'Home' ? handleMouseLeave : null} // Ocultar menú
          >
            {/* Removemos href="#" para evitar recarga de la página */}
            <button
              onClick={(e) => handleClick(e, section)}
              className={`text-black font-bold text-[18px] block text-center py-4 w-full transition-colors duration-300 ${
                activeSection === section
                  ? 'border-b-4 border-[#d26745] text-[#d26745]'
                  : 'border-b-4 border-transparent hover:border-[#d26745] hover:text-[#d26745]'
              }`}
              style={{ fontFamily: 'Josefin Sans, sans-serif' }}
            >
              {section}
              {section === 'Home' && (
                <span className="ml-2 inline-block w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></span>
              )}
            </button>
            {/* Menú desplegable de ejemplo para "Home"  */}
            {section === 'Home' && isDropdownOpen && (
              <ul className="absolute left-0 w-full bg-white shadow-lg">
                <li>
                  <button
                    onClick={(e) => handleClick(e, 'Subsection 1')}
                    className="block py-2 text-black text-center transition-colors duration-300 hover:bg-[#f2d35d] w-full"
                  >
                    Subsection 1
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => handleClick(e, 'Subsection 2')}
                    className="block py-2 text-black text-center transition-colors duration-300 hover:bg-[#f2d35d] w-full"
                  >
                    Subsection 2
                  </button>
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
