// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventsRouter = require('./routes/rutasGenerales');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/dbTIT', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected...'))  // Mensaje al conectarse
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Rutas
app.use('/api', eventsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    onsole.log(`Server running on port ${PORT}`);
});