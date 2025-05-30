// auth-service/src/server.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL, // Usa apenas FRONTEND_URL, sem fallback
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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