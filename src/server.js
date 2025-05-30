// auth-service/src/server.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Lista de origens permitidas
const allowedOrigins = [
  'https://smi.up.railway.app', // URL de frontend em produção
  process.env.FRONTEND_URL,    // URL configurada via variável de ambiente
].filter(Boolean); // Remove valores undefined/null se FRONTEND_URL não estiver definida

// Configurar CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex.: Postman) ou se a 'origin' estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`ERRO DE CORS: A origem '${origin}' não é permitida.`);
      console.error(`Origens permitidas: ${allowedOrigins.join(', ')}`);
      callback(new Error(`A origem '${origin}' não é permitida pela política de CORS.`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rotas de autenticação
app.use('/auth', authRoutes);

// Middleware para tratar erros de rota não encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware para tratar outros erros
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serviço de autenticação rodando na porta ${PORT}`);
  console.log(`Origens CORS permitidas: ${allowedOrigins.join(', ')}`);
  if (!process.env.FRONTEND_URL) {
    console.warn('Atenção: A variável de ambiente FRONTEND_URL não está definida. Verifique as configurações no Railway.');
  }
  if (!process.env.JWT_SECRET) {
    console.error('ERRO CRÍTICO: A variável de ambiente JWT_SECRET não está definida! O serviço não funcionará corretamente.');
    // process.exit(1); // Descomente se quiser forçar a parada em produção
  }
});