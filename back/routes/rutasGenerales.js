const express = require('express');
const router = express.Router();

// Importar los controladores
const profesionalController = require('../controllers/profesionalController');
const horasSemanalesController = require('../controllers/horasSemanalesController');
const sesionesController = require('../controllers/sesionesController');

// Rutas para Profesional
router.post('/profesionales', profesionalController.createProfesional);
router.get('/profesionales', profesionalController.getAllProfesionales);
router.get('/profesionales/:id', profesionalController.getProfesionalById);
router.put('/profesionales/:id', profesionalController.updateProfesional);
router.delete('/profesionales/:id', profesionalController.deleteProfesional);

// Rutas para Horas Semanales
router.post('/horas-semanales', horasSemanalesController.createHorasSemanales);
router.get('/horas-semanales', horasSemanalesController.getAllHorasSemanales);
router.get('/horas-semanales/:weekId', horasSemanalesController.getHorasSemanalesById);
router.put('/horas-semanales/:weekId', horasSemanalesController.updateHorasSemanales);
router.delete('/horas-semanales/:weekId', horasSemanalesController.deleteHorasSemanales);

// Rutas para Sesiones
router.post('/sesiones', sesionesController.createSesion);
router.get('/sesiones', sesionesController.getAllSesiones);
router.get('/sesiones/:id', sesionesController.getSesionById);
router.put('/sesiones/:id', sesionesController.updateSesion);
router.delete('/sesiones/:id', sesionesController.deleteSesion);

module.exports = router;