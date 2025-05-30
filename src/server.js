// auth-service/src/server.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); // Adicionado
require('dotenv').config();

const app = express();

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:8080', // Permite requisições do frontend em localhost:8080
  methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});