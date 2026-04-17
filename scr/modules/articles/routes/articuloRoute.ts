import { Router } from 'express';
import {
  obtenerArticulos,
  obtenerArticulosConDescuento,
  sincronizarArticulos
} from '../controllers/articuloController';
import { authMiddleware } from '../../../middleware/AuthMiddleware';

const router = Router();

router.get('/articulos', authMiddleware, obtenerArticulos);

router.get('/articulos/descuento', authMiddleware, obtenerArticulosConDescuento);

router.post('/articulos/sync', authMiddleware, sincronizarArticulos);

export default router;