import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './modules/auth/routes/authRoutes';
import articuloRoutes from './modules/articles/routes/articuloRoute';

dotenv.config();

const PORT = process.env['PORT'] || 1882;

const app = express();

app.use(cors()); 
app.use(cors({ origin: 'http://localhost:8081' }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', articuloRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});